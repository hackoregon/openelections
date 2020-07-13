import 'reflect-metadata';
import { createConnection, Connection, getConnectionManager } from 'typeorm';
import ORMConfig from './ormconfig';
export default async (): Promise<Connection> => {
    try {
        const connection: Connection = await createConnection(ORMConfig);
        // This is safe to do in prod and dev because it tracks what migrations have ran already in the db.
        if (process.env.NODE_ENV === 'production') {
            // If migrations are needed, use this code:
            // await connection.runMigrations();
        }
        return connection;
    } catch (error) {
        console.log('Using existing default db connection.');
        const existingConnection = getConnectionManager().get('default');
        return existingConnection;
    }
};
