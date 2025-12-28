import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    await app.listen(process.env.PORT ?? 3000);
  }

  return app;
}

if (!process.env.VERCEL) {
  bootstrap().catch((error) => {
    console.error('Failed to start the application:', error);
  });
}
