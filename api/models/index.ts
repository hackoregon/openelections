import "reflect-metadata";
import {createConnection} from "typeorm";

export default createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
    logging: true
})
