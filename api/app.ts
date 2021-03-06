import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import { setupRoutes } from './routes';
import db from './models/db';
import bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';

/***
    corsOptions set to return all Access-Control-Allow-Origin headers with requesting domain
    Solves for credentialed cross domain request that will not accept * wildcard
    See link to create a white list:
        https://expressjs.com/en/resources/middleware/cors.html#configuring-cors-w-dynamic-origin
***/
const corsOptions = {
  origin: function (origin, callback) {
      callback(null, true);
  },
  credentials: true
};

(async () => {
    await db();
    const app: express.Express = express();

    if (process.env.NODE_ENV === 'production') {
        const bugsnagClient = bugsnag({
            apiKey: process.env.BUG_SNAG_API_KEY,
            releaseStage: process.env.APP_ENV
        });
        bugsnagClient.use(bugsnagExpress);
        const middleware = bugsnagClient.getPlugin('express');
        app.use(middleware.requestHandler);
        app.use(middleware.errorHandler);
    }
    app.use(logger('dev'));
    app.use(fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 10 * 1024 * 1024 * 1024 // 10MB max file(s) size
        },
        useTempFiles : true,
        tempFileDir : '/app/uploads',
        debug: false // flip to true for local testing
    }));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    setupRoutes(app);
    return app.listen(3000);
})();
