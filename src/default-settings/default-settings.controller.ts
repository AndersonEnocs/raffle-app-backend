import { Body, Controller, Get, Post } from '@nestjs/common';
import { DefaultSettingsService } from './services/default-settings.service';
import { CreateAppSettingDto } from './dtos/create-app-setting.dto';

@Controller('default-settings')
export class DefaultSettingsController {
  constructor(private readonly defaultSettingsService: DefaultSettingsService) {}

  @Post()
  async createSettings(@Body() settings: CreateAppSettingDto[]) {
    return this.defaultSettingsService.createMany(settings as any);
  }

  @Post('one')
  async createOne(@Body() setting: CreateAppSettingDto) {
    return this.defaultSettingsService.createOne(setting as any);
  }

  @Get()
  async getSettings() {
    return this.defaultSettingsService.getSettings();
  }
}

