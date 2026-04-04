import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  if (configService.get<boolean>('auth.devBypass')) {
    Logger.warn(
      '[AUTH] AUTH_DEV_BYPASS está activo: peticiones sin Bearer usan AUTH_DEV_BYPASS_USER_ID. No uses esto en producción.',
    );
  }

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS abierto: acepta cualquier origen (app local / LAN)
  const corsOrigins = process.env.CORS_ORIGINS;
  app.enableCors(
    corsOrigins === '*'
      ? { origin: true, credentials: true }
      : {
          origin: corsOrigins?.split(',') || ['http://localhost:8081'],
          credentials: true,
        },
  );

  // Healthcheck fuera del global prefix para que nginx pueda chequearlo facilmente
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const config = new DocumentBuilder()
    .setTitle('BabyGuardian API')
    .setDescription('BabyGuardian Backend API - Smart Baby Monitor')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`BabyGuardian API running on: ${await app.getUrl()}`);
  console.log(`Swagger docs: ${await app.getUrl()}/api/docs`);
}
bootstrap();
