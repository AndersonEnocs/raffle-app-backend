import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TicketStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Schema({ collection: 'tickets', timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'Raffle', required: true })
  raffleId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: [Number], required: true })
  numbers: number[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  stripeCheckoutSessionId?: string;

  @Prop({ enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;
}

export type TicketDocument = Ticket & Document;

export const TicketSchema = SchemaFactory.createForClass(Ticket);

