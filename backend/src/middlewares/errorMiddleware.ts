import { Request, Response, NextFunction } from 'express';
import { log } from '../logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  log.error(err);
  if (err?.code === 'P2025') { // prisma not found
    return res.status(404).json({ error: 'Resource not found' });
  }
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}