import { Module, forwardRef } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { DefaultSettingsModule } from '../default-settings/default-settings.module';

@Module({
  imports: [forwardRef(() => DefaultSettingsModule)],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}

