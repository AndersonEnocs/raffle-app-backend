import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'app_settings', timestamps: true })
export class AppSettings {
  @Prop({ required: true, unique: true })
  attribute: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  description?: string;
}

export type AppSettingsDocument = AppSettings & Document;

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettings);

