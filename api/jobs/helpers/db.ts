import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ORMConfig from '../../models/ormconfig';

export default async (): Promise<DataSource> => {
    if (!global.oaeJobConnection || !global.oaeJobConnection.isConnected) {
        try {
            // const connection: Connection = await createConnection(ORMConfig);
            const jobOrmConfig = {
                ...ORMConfig,
                entities: ['/app/build/models/entity/*.js'],
                synchronize: false,
                migrations: undefined,
            };

            const connection: DataSource = new DataSource(jobOrmConfig);
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
    return global.oaeJobConnection;
};
