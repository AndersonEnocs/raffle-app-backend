import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Raffle, RaffleDocument } from '../../raffle/schemas/raffle.schema';
import { Ticket, TicketDocument, TicketStatus } from '../schemas/ticket.schema';
import { PurchaseTicketsDto } from '../dtos/purchase-tickets.dto';
import { RaffleAvailabilityField } from '../../raffle/utilities/raffle-availability.enum';
import { StripeService } from '../../payment/services/stripe.service';
import { QueryTicket } from '../queries/query-ticket';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    @InjectModel(Raffle.name) private readonly raffleModel: Model<RaffleDocument>,
    private readonly stripeService: StripeService,
  ) {}


  async getPaidPlayers(raffleId: string) {
    const tickets = await this.ticketModel.aggregate(
      QueryTicket.paidByRaffle(raffleId),
    );
    return tickets;
  }

  async purchaseTickets(raffleId: string, dto: PurchaseTicketsDto) {
    const raffle = await this.raffleModel.findById(raffleId).lean();
    if (!raffle) {
      throw new NotFoundException('Raffle not found.');
    }

    const uniqueNumbers = Array.from(new Set(dto.numbers));
    if (uniqueNumbers.length !== dto.numbers.length) {
      throw new BadRequestException('Duplicate ticket numbers are not allowed.');
    }

    const invalid = uniqueNumbers.filter((n) => n < 1 || n > raffle.totalTickets);
    if (invalid.length) {
      throw new BadRequestException(`One or more ticket numbers are out of range.`);
    }

    const taken = new Set<number>((raffle.takenNumbers as number[]) || []);
    const alreadyTaken = uniqueNumbers.filter((n) => taken.has(n));
    if (alreadyTaken.length) {
      throw new BadRequestException(`Some selected numbers are no longer available.`);
    }

    const count = uniqueNumbers.length;
    let totalAmount = raffle.price * count;

    const BULK_DISCOUNT_THRESHOLD = 10;
    const BULK_DISCOUNT_FACTOR = 0.5;
    if (count > BULK_DISCOUNT_THRESHOLD) {
      totalAmount = totalAmount * BULK_DISCOUNT_FACTOR;
    }

    const amountInCents = Math.round(totalAmount * 100);
    const currency = 'usd';

    const session = await this.stripeService.createCheckoutSession({
      amountInCents,
      currency,
      description: `Raffle ${raffle.title} - tickets ${uniqueNumbers.join(', ')}`,
      metadata: {
        raffleId: String(raffle._id),
        numbers: uniqueNumbers.join(','),
      },
    });

    const ticket = await new this.ticketModel({
      raffleId: new Types.ObjectId(raffleId),
      name: dto.name,
      phone: dto.phone,
      numbers: uniqueNumbers,
      totalAmount,
      currency,
      stripeCheckoutSessionId: session.id,
      status: TicketStatus.PAID,
    }).save();

    await this.raffleModel.updateOne(
      { _id: raffle._id },
      {
        $inc: {
          ticketsSold: count,
          ticketsAvailable: -count,
        },
        $addToSet: {
          takenNumbers: { $each: uniqueNumbers },
        },
      },
    );

    return {
      ticketId: ticket._id,
      checkoutUrl: session.url,
      totalAmount,
      currency,
    };
  }

  async getRaffleTicketsInfo(raffleId: string) {
    const raffle = await this.raffleModel
      .findById(raffleId)
      .select([
        RaffleAvailabilityField.TOTAL_TICKETS,
        RaffleAvailabilityField.TICKETS_AVAILABLE,
        RaffleAvailabilityField.TICKETS_SOLD,
        RaffleAvailabilityField.TAKEN_NUMBERS,
      ])
      .lean();

    if (!raffle) {
      throw new NotFoundException('Raffle not found.');
    }

    const total = raffle.totalTickets ?? 0;
    const taken = new Set<number>((raffle.takenNumbers as number[]) || []);

    const availableNumbers: number[] = [];
    for (let i = 1; i <= total; i++) {
      if (!taken.has(i)) {
        availableNumbers.push(i);
      }
    }

    return {
      totalTickets: total,
      ticketsAvailable: raffle.ticketsAvailable,
      ticketsSold: raffle.ticketsSold,
      availableNumbers,
    };
  }
}

