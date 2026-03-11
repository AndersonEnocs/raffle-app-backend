import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../../payment/services/stripe.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus } from '../schemas/ticket.schema';
import { constantsAppSettings } from '../../const';

@Controller('payments/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = (this as any).stripeService['getStripeClient']() as Stripe;
    const webhookSecret = constantsAppSettings.stripeWebhookSecret;

    const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(body);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      return { received: false };
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const ticketId = session.metadata?.ticketId;
      if (ticketId) {
        await this.ticketModel.updateOne(
          { _id: ticketId },
          { $set: { status: TicketStatus.PAID } },
        );
      }
    }

    return { received: true };
  }
}

