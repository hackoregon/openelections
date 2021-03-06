import 'reflect-metadata';
import { createConnection, Connection, getConnection } from 'typeorm';

export default async (): Promise<Connection> => {
    try {
        const connection: Connection = await createConnection({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
                '/app/build/models/entity/*.js'
            ],
            synchronize: false,
            logging: false
        });

        return connection;
    } catch (e) {
        return getConnection('default');
    }

};
