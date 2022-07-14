import * as dotenv from 'dotenv';
import util from 'util';
import App from './app';
import logger from './core/utils/logger';
import SafeMongooseConnection from './lib/safe-mongoose-connection';

const result = dotenv.config();

if (result.error) dotenv.config({ path: '.env.default' });

const app = new App();

const PORT = process.env.PORT || 3000;

let debugCallback;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (
    collectionName: string,
    method: string,
    query: any,
    doc: string,
  ): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, {
      colors: true,
      depth: null,
    })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' },
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.MONGODB_CONNECTION ?? '',
  debugCallback,
  onStartConnection: (mongoUrl) =>
    logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) =>
    logger.log({
      level: 'error',
      message: `Could not connect to MongoDB at ${mongoUrl}`,
      error,
    }),
  onConnectionRetry: (mongoUrl) =>
    logger.info(`Retrying to MongoDB at ${mongoUrl}`),
});

if (process.env.MONGODB_CONNECTION == null) {
  logger.error(
    'MONGODB_CONNECTION not specified in environment',
    new Error('MONGODB_CONNECTION not specified in environment'),
  );
  process.exit(1);
} else {
  safeMongooseConnection.connect((mongoUrl) => {
    logger.info(`Connected to MongoDB at ${mongoUrl}`);
    app.start();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  safeMongooseConnection.close((err) => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err,
      });
    } else {
      logger.info('Mongo connection closed successfully');
    }

    process.exit(0);
  }, true);
});
