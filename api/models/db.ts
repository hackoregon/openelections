import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as ORMConfig from './ormconfig';
export default async (): Promise<Connection> => {
    const connection: Connection = await createConnection(ORMConfig);
    return connection;
};
