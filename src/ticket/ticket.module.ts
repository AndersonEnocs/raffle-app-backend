import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketService } from './services/ticket.service';
import { TicketController } from './controllers/ticket.controller';
import { StripeWebhookController } from './controllers/stripe-webhook.controller';
import { Raffle, RaffleSchema } from '../raffle/schemas/raffle.schema';
import { PaymentModule } from '../payment/payment.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Raffle.name, schema: RaffleSchema },
    ]),
    PaymentModule,
    forwardRef(() => AdminModule),
  ],
  controllers: [TicketController, StripeWebhookController],
  providers: [TicketService],
})
export class TicketModule {}

