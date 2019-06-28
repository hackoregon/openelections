import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import { setupRoutes } from './routes';
import db from './models/db';


(async () => {
    await db();
    const app: express.Express = express();
    app.use(logger('dev'));
    app.use(cors());
    setupRoutes(app);
    return app.listen(3000);
})();
