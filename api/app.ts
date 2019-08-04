import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import { setupRoutes } from './routes';
import db from './models/db';

/***
    corsOptions set to return all Access-Control-Allow-Origin headers with requesting domain
    Solves for credentialed cross domain request that will not accept * wildcard
    See link to create a white list:
        https://expressjs.com/en/resources/middleware/cors.html#configuring-cors-w-dynamic-origin
***/
let corsOptions = {
  origin: function (origin, callback) {
      callback(null, true);
  },
  credentials: true
};

(async () => {
    await db();
    const app: express.Express = express();
    app.use(logger('dev'));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    setupRoutes(app);
    return app.listen(3000);
})();
