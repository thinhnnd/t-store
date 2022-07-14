import { NextFunction, Request, Response } from 'express';
import logger from '../core/utils/logger';

export const logResponseTimeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startHrTime = process.hrtime();

  console.log(startHrTime);
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);

    console.log('end', elapsedHrTime);

    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' },
    });
  });

  next();
};
