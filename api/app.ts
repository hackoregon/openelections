import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from "body-parser";
import { AppRoutes } from "./routes";
import db from "./models/db";
import passport from './auth/passport';

export default db().then( async connection => {
    const app = express();
    app.use(bodyParser.json());
    passport(app, connection);

    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: express.Request, response: express.Response, next: Function) => {
            route.action(request, response, next)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    app.use(logger('dev'));



    return app.listen(3000);
  });
