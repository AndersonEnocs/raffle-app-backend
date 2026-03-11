import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

export class PurchaseTicketsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('VE', { message: 'phone must be a valid phone number' })
  phone?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  numbers: number[];
}

