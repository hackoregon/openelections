import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ORMConfig from './ormconfig';

export default async function db(): Promise<DataSource> {
    if (!global.oaeConnection || !global.oaeConnection.isConnected) {
        try {
            // const connection: Connection = await createConnection(ORMConfig);

            const connection: DataSource = new DataSource(ORMConfig);
            global.oaeConnection = await connection.initialize();

            // This is safe to do in prod and dev because it tracks what migrations have ran already in the db.
            if (process.env.NODE_ENV === 'production') {
                // If migrations are needed, use this code:
                // await connection.runMigrations();
            }
        } catch (error) {
            console.log('Using existing default db connection.');
        }
    }
    return global.oaeConnection;
}
