import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DefaultSettingsService } from './default-settings/services/default-settings.service';
import { SettingsMapper } from './settings-mapper';

// Variable para cachear la instancia y no reinicializar todo en cada petición
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
      ],
      exposedHeaders: ['Authorization'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

   
    await app.init();

    const settingsService = app.get(DefaultSettingsService);
    const settings = await settingsService.getSettings();
    SettingsMapper.mapSettings(settings);

    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

if (process.env.NODE_ENV !== 'production') {
  const startLocal = async () => {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  };
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};