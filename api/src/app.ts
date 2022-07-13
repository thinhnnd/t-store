import mongoose from 'mongoose';
import { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as cors from 'cors';
import 'dotenv/config';
import './controllers/home.controller';

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

  private connectToTheDatabase() {
    const { MONGODB_CONNECTION } = process.env;
    mongoose
      .connect(MONGODB_CONNECTION)
      .then(() => console.info(`[Mongoose] Database is successfully connected`))
      .catch((error) =>
        console.error('[Mongoose]: Error while conencted to database ', error),
      );
  }

  public listen() {
    const { APP_PORT } = process.env;

    this.app.listen(5000, () => {
      console.log(`[APP] App listening on the port ${APP_PORT}`);
    });
  }

  // Need boolean return type
  public start() {
    this.connectToTheDatabase();
    let server = new InversifyExpressServer(this.container);
    server.setConfig((app) => {
      app.use(bodyParser.json());
      app.use(helmet());
      const corsOptions = {
        origin: '*',
      };
      app.use(cors(corsOptions));
    });

    this.app = server.build();

    this.listen();
  }
}

export default App;
