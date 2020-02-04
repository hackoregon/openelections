import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as ORMConfig from './ormconfig';
export default async (): Promise<Connection> => {
    const connection: Connection = await createConnection(ORMConfig);
    // This is safe to do in prod and dev because it tracks what migrations have ran already in the db.
    if (process.env.NODE_ENV === 'production') {
        // If migrations are needed, add use this code:
        // await connection.runMigrations();
    }
    return connection;
};
