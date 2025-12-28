import { NestFactory } from '@nestjs/core';
import { bootstrap } from './app-setup';
import { Request, Response } from 'express';

// Default export for Vercel serverless environment
export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};

if (!process.env.VERCEL) {
  bootstrap()
    .then(async (app) => {
      // Explicitly reference NestFactory to satisfy Vercel's framework detection scanner
      if (NestFactory) {
        await app.listen(process.env.PORT ?? 3000);
      }
    })
    .catch((error) => {
      console.error('Failed to start the application:', error);
    });
}
