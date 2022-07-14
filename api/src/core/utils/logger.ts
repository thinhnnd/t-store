import { createLogger, format, transports } from 'winston';
import WinstonConsoleLoggerTransport from '../../lib/winston-console-logger-transport';

const logTransports = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack,
          };
        }
        return value;
      },
    }),
  }),
  new WinstonConsoleLoggerTransport(),
];

console.log(process.env.NODE_ENV === 'development' ? 'silly' : 'info');

const logger = createLogger({
  format: format.combine(format.timestamp()),
  transports: logTransports,
  defaultMeta: { service: 'api' },
  level: process.env.NODE_ENV === 'development' ? 'silly' : 'info',
});

export default logger;
