import * as express from 'express';
import * as logger from 'morgan';
import { setupRoutes } from './routes';
import db from './models/db';

(async () => {
    await db();
    const app: express.Express = express();

    setupRoutes(app);

    app.use(logger('dev'));
    return app.listen(3000);
})();
