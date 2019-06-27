import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

export default async (): Promise<Connection> => {
    let connection: Connection;

    connection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
            __dirname + '/entity/*.ts'
        ],
        synchronize: true,
        logging: process.env.NODE_ENV === 'development'
    });

    return connection;
};
