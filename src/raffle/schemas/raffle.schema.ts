import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'raffles', timestamps: true })
export class Raffle {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  totalTickets: number;

  @Prop({ required: true, min: 0 })
  ticketsAvailable: number;

  @Prop({ required: true, min: 0, default: 0 })
  ticketsSold: number;

  // Números actualmente tomados (reservados o vendidos).
  // En el futuro, el flujo de compra/reserva irá llenando este arreglo.
  @Prop({ type: [Number], default: [] })
  takenNumbers: number[];

  @Prop({ type: [String], default: [] })
  images: string[];
}

export type RaffleDocument = Raffle & Document;

export const RaffleSchema = SchemaFactory.createForClass(Raffle);

