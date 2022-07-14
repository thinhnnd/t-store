import * as dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) dotenv.config({ path: '.env.default' });

interface DatabaseConfig {
  connectionString?: string;
  host?: number;
  username?: string;
  databse?: string;
  port?: number;
}

interface AppConfig {
  env?: string;
  port?: number;
  isSwaggerEnable?: boolean;
  database?: DatabaseConfig;
}

export const CONFIGURATION: AppConfig = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.APP_PORT, 10) || 5000,
  isSwaggerEnable: Boolean(process.env.SWAGGER_PLAYGROUND) || false,
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
    host: parseInt(process.env.DB_HOST, 10),
    username: process.env.DB_USERNAME,
    databse: process.env.DB_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10),
  },
};
