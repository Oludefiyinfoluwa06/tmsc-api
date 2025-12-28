import { Request, Response } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { bootstrap } from '../src/app-setup';

let cachedApp: NestExpressApplication;

export default async (req: Request, res: Response) => {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  const instance = cachedApp.getHttpAdapter().getInstance();
  instance(req, res);
};
