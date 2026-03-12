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

    // allow any origin and mirror it back to support credentials requests.  
    // using a callback avoids the `"*"` vs credentials restriction and lets us
    // dynamically accept whatever origin the browser sends.  in production you
    // could replace this with a whitelist from an env variable if you want tighter
    // control, but for development / cross‑platform clients (ionic, electron, etc.)
    // this configuration will never trigger a cors failure.
    app.enableCors({
      origin: (origin, callback) => {
        // origin may be undefined for non-browser clients (Postman, curl), so we
        // just allow them as well.
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
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

   
    await app.init();

    const settingsService = app.get(DefaultSettingsService);
    const settings = await settingsService.getSettings();
    SettingsMapper.mapSettings(settings);

    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

if (process.env.NODE_ENV !== 'production') {
  // When running locally (e.g. via `npm run start` or `nest start`),
  // start a traditional HTTP server. In production (Vercel) we export
  // a handler instead and rely on serverless invocation, so we skip
  // this.
  const startLocal = async () => {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  };

  // invoke immediately so the process actually listens on a port
  startLocal();
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};