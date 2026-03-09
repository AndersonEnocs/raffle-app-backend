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

  @Prop({ type: [String], default: [] })
  images: string[];
}

export type RaffleDocument = Raffle & Document;

export const RaffleSchema = SchemaFactory.createForClass(Raffle);

