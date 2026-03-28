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

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:8081'],
    credentials: true,
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
