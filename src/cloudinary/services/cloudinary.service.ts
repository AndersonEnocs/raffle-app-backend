import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { constantsAppSettings } from '../../const';
import { DefaultSettingsService } from '../../default-settings/services/default-settings.service';
import { SettingsMapper } from '../../settings-mapper';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    @Inject(forwardRef(() => DefaultSettingsService))
    private readonly defaultSettingsService: DefaultSettingsService,
  ) {}

  async onModuleInit() {
    const settings = await this.defaultSettingsService.getSettings();
    SettingsMapper.mapSettings(settings);

    const cloudName = constantsAppSettings.cloudinaryCloudName;
    const apiKey = constantsAppSettings.cloudinaryApiKey;
    const apiSecret = constantsAppSettings.cloudinaryApiSecret;

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('Cloudinary credentials not found. Check settings in DB.');
      throw new InternalServerErrorException('Cloudinary credentials are not configured.');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    this.logger.log('CloudinaryService initialized successfully.');
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'admin',
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            this.logger.error('Cloudinary API returned an error', error);
            return reject(new InternalServerErrorException('Failed to upload image to Cloudinary.'));
          }
          const publicUrl = result.secure_url;
          this.logger.log(`Image uploaded successfully to Cloudinary. URL: ${publicUrl}`);
          resolve(publicUrl);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async uploadRaffleImages(files: Express.Multer.File | Express.Multer.File[]): Promise<string[]> {
    const fileArray = Array.isArray(files) ? files : [files];

    const uploadPromises = fileArray.map((file) => {
      return new Promise<string | null>((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'raffles',
            resource_type: 'auto',
          },
          (error, result: UploadApiResponse) => {
            if (error) {
              this.logger.error('Error uploading raffle image to Cloudinary', error);
              return resolve(null);
            }

            const publicUrl = result.secure_url;
            this.logger.log(`Raffle image uploaded to Cloudinary. URL: ${publicUrl}`);
            resolve(publicUrl);
          },
        );

        Readable.from(file.buffer).pipe(uploadStream);
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((url): url is string => url !== null);

      if (successfulUploads.length === 0) {
        throw new Error('No raffle image could be uploaded to Cloudinary');
      }

      return successfulUploads;
    } catch (error) {
      this.logger.error('Error uploading one or more raffle images', error);
      throw new InternalServerErrorException('Error uploading one or more raffle images to Cloudinary');
    }
  }
}

