import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Raffle, RaffleSchema } from './schemas/raffle.schema';
import { RaffleService } from './services/raffle.service';
import { RaffleController } from './controllers/raffle.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Raffle.name, schema: RaffleSchema }]),
    CloudinaryModule,
    forwardRef(() => AdminModule),
  ],
  controllers: [RaffleController],
  providers: [RaffleService],
})
export class RaffleModule {}

