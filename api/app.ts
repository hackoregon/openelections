import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import db from './models';

const app = express();
db.then( async connection => {
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

  export default app; // for testing
