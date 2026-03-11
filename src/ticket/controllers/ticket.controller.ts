import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { PurchaseTicketsDto } from '../dtos/purchase-tickets.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post(':id/purchase')
  @UsePipes(new ValidationPipe())
  async purchase(
    @Param('id') raffleId: string,
    @Body() dto: PurchaseTicketsDto,
  ) {
    return this.ticketService.purchaseTickets(raffleId, dto);
  }

  @Get(':id/tickets-info')
  async getTicketsInfo(@Param('id') raffleId: string) {
    return this.ticketService.getRaffleTicketsInfo(raffleId);
  }
}

