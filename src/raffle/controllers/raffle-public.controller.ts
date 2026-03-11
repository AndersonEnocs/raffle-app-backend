import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../shared/dtos/api-response.dto';
import { Raffle } from '../schemas/raffle.schema';
import { RaffleService } from '../services/raffle.service';

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
}

