import { Request, Response } from 'express';
import { bootstrap } from '../src/main';

export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};
