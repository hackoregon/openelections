import * as express from'express';
import * as logger from 'morgan';
import * as bodyParser from "body-parser";
import { AppRoutes } from "./routes";
import db from "./models";

db.then( async connection => {
    const app = express();
    app.use(bodyParser.json());

    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: express.Request, response: express.Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    app.use(logger('dev'));


    app.listen(3000);
});

