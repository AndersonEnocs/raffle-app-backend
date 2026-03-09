import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSettings, AppSettingsDocument } from '../schemas/app-settings.schema';

@Injectable()
export class DefaultSettingsService {
  constructor(
    @InjectModel(AppSettings.name)
    private readonly appSettingsModel: Model<AppSettingsDocument>,
  ) {}

  async getSettings(): Promise<AppSettings[]> {
    return this.appSettingsModel.find().lean();
  }

  async getByAttribute(attribute: string): Promise<AppSettings | null> {
    return this.appSettingsModel.findOne({ attribute }).lean();
  }

  async createMany(settings: AppSettings[]): Promise<AppSettings[]> {
    if (!settings || !settings.length) {
      return [];
    }

    const bulk = settings.map((setting) => ({
      updateOne: {
        filter: { attribute: setting.attribute },
        update: {
          $set: {
            value: setting.value,
            description: setting.description,
          },
        },
        upsert: true,
      },
    }));

    await this.appSettingsModel.bulkWrite(bulk);

    return this.getSettings();
  }

  async createOne(setting: AppSettings): Promise<AppSettings> {
    const existing = await this.appSettingsModel.findOne({
      attribute: setting.attribute,
    });

    if (existing) {
      existing.value = setting.value;
      existing.description = setting.description;
      return existing.save();
    }

    const created = new this.appSettingsModel(setting);
    return created.save();
  }
}

