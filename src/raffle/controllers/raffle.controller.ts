import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileTypeValidator } from '@nestjs/common';
import { AdminJwtGuard } from '../../admin/guards/admin-jwt.guard';
import { CreateRaffleDto } from '../dtos/create-raffle.dto';
import { RaffleService } from '../services/raffle.service';
import { ApiResponseDto } from '../../shared/dtos/api-response.dto';
import { Raffle } from '../schemas/raffle.schema';

@Controller('admin/raffles')
@UseGuards(AdminJwtGuard)
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() dto: CreateRaffleDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    images?: Express.Multer.File[],
  ): Promise<ApiResponseDto<Raffle>> {
    const raffle = await this.raffleService.create(dto, images);
    return {
      statusCode: 700,
      message: 'Raffle created successfully.',
      data: raffle,
    };
  }

  
}

