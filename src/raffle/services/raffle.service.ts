import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { CreateRaffleDto } from '../dtos/create-raffle.dto';
import { Raffle, RaffleDocument } from '../schemas/raffle.schema';

@Injectable()
export class RaffleService {
  constructor(
    @InjectModel(Raffle.name) private readonly raffleModel: Model<RaffleDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateRaffleDto, images?: Express.Multer.File[]): Promise<Raffle> {
    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('Title is required.');

    if (dto.price === undefined || dto.price === null || dto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero.');
    }

    if (dto.totalTickets === undefined || dto.totalTickets === null || dto.totalTickets <= 0) {
      throw new BadRequestException('Total tickets must be greater than zero.');
    }

    const exists = await this.raffleModel.exists({ title });
    if (exists) throw new BadRequestException('A raffle with this title already exists.');

    const imageUrls = images?.length ? await this.cloudinaryService.uploadRaffleImages(images) : [];

    return new this.raffleModel({
      title,
      description: dto.description?.trim(),
       price: dto.price,
      totalTickets: dto.totalTickets,
      images: imageUrls,
    }).save();
  }

  async getLatest(): Promise<Raffle> {
    const raffle = await this.raffleModel.findOne().sort({ createdAt: -1 }).lean();
    if (!raffle) throw new NotFoundException('No raffles found.');
    return raffle as any;
  }
}

