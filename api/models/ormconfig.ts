import { ConnectionOptions } from 'typeorm';

const ORMConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    __dirname + '/entity/*{.ts,.js}',
  ],
  migrations: [
    __dirname + '/migrations/*{.ts,.js}',
  ],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  cli: {
    entitiesDir: 'models/entity',
    migrationsDir: 'models/migrations',
  },
};
export default ORMConfig;