import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { setupRoutes } from './routes';
import db from './models/db';

(async () => {
    await db();
    const app: express.Express = express();
    app.use(bodyParser.json());

    setupRoutes(app);

    app.use(logger('dev'));
    return app.listen(3000);
})();
