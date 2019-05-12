import { login, invite } from '../controller/users';
import * as express from 'express';
import { getCurrentUser } from './helpers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
// @ts-ignore
import { Response, Request } from 'express';
import { IToken } from '../services/permissionService';

interface Request {
    currentUser?: IToken;
}

export const AppRoutes = [
    {
        path: '/me',
        method: 'get',
        action: async (request: Request, response: Response) => {
            return response.status(200).json(request.currentUser);
        }
    },
    {
        path: '/users/login',
        method: 'post',
        action: login
    },
    {
        path: '/users/invite',
        method: 'post',
        action: invite
    },
];

export function setupRoutes(app: express.Express) {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(getCurrentUser);
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: express.Request, response: express.Response, next: Function) => {
            route.action(request, response, next).then(() => next).catch(err => next(err));
        });
    });
}
