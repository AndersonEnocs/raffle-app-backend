import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponseDto } from '../../shared/dtos/api-response.dto';
import { Raffle } from '../schemas/raffle.schema';
import { RaffleService } from '../services/raffle.service';
import { RaffleAvailability } from '../utilities/raffle-availability.enum';

@Controller('raffles')
export class RafflePublicController {
  constructor(private readonly raffleService: RaffleService) {}

  @Get('latest')
  async getLatest(): Promise<ApiResponseDto<Raffle>> {
    const raffle = await this.raffleService.getLatest();
    return {
      statusCode: 700,
      message: 'Latest raffle fetched successfully.',
      data: raffle,
    };
  }

  @Get(':id/availability')
  async getAvailability(
    @Param('id') id: string,
  ): Promise<
    ApiResponseDto<RaffleAvailability>
  > {
    const data = await this.raffleService.getAvailability(id);
    return {
      statusCode: 700,
      message: 'Raffle availability fetched successfully.',
      data,
    };
  }
}

