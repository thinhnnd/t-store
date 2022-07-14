import 'reflect-metadata';
import { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as cors from 'cors';
import './controllers';
import logger from './core/utils/logger';
import { logResponseTimeMiddleware } from './middlewares/log-response-time.middleware';
class App {
  public app: Application;
  public server: InversifyExpressServer;
  public container: Container;

  constructor() {
    this.app = express();
    this.container = new Container();

    this.initializeContainer();
  }

  private initializeContainer() {}

  private listen() {
    const { APP_PORT } = process.env;

    this.app.listen(5000, () => {
      logger.info(
        `🌏[APP] Server has servered at http://localhost:${APP_PORT}`,
      );
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'staging'
      )
        logger.info(
          `⚙️  Swagger UI hosted at http://localhost:${APP_PORT}/dev/api-docs`,
        );
    });
  }

  private createServer(): InversifyExpressServer {
    let server = new InversifyExpressServer(this.container);
    server.setConfig((app) => {
      app.use(logResponseTimeMiddleware);
      app.use(bodyParser.json());
      app.use(helmet());
      const corsOptions = {
        origin: '*',
      };
      app.use(cors(corsOptions));
    });

    return server;
  }

  // Need boolean return type
  public start() {
    this.app = this.createServer().build();

    this.listen();
  }
}

export default App;
