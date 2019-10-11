import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

export default async (): Promise<Connection> => {
    let connection: Connection;
    let entities = [
        __dirname + '/entity/*.ts'
    ];
    if (process.env.NODE_ENV === 'production') {
        entities = [
            __dirname + '/entity/*.js'
        ];
    }
    connection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities,
        synchronize: true,
        logging: false
    });

    return connection;
};
