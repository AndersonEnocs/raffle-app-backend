import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppSettingDto {
  @IsString()
  @IsNotEmpty()
  attribute: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}

