import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { DefaultSettingsService } from './default-settings/services/default-settings.service';
import { SettingsMapper } from './settings-mapper';

let cachedApp: any;

function configureApp(app: INestApplication) {
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders:[
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
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
}

async function loadSettings(app: INestApplication) {
  const settingsService = app.get(DefaultSettingsService);
  const settings = await settingsService.getSettings();
  SettingsMapper.mapSettings(settings);
}

async function bootstrapServerless() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    await loadSettings(app);
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule);
  
  configureApp(app);
  
  await app.init();
  await loadSettings(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo exitosamente en el puerto: ${port}`);
}

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  bootstrapServer();
}

export default async (req: any, res: any) => {
  const app = await bootstrapServerless();
  app(req, res);
};