import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import db from './models';
import { initialSeedInit } from './models/seeds/users';

export default db.then( async connection => {
    const app = express();
    app.use(bodyParser.json());

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        await initialSeedInit(connection);
    }

    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: express.Request, response: express.Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    app.use(logger('dev'));



    return app.listen(3000);
  });
