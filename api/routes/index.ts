import { login, invite } from '../controller/users';
import * as express from 'express';
import { getCurrentUser, IRequest } from './helpers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Response } from 'express';

export const AppRoutes = [
    {
        path: '/me',
        method: 'get',
        action: async (request: IRequest, response: Response) => {
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
        app[route.method](route.path, (request: IRequest, response: express.Response, next: Function) => {
            route.action(request, response, next).then(() => next).catch(err => next(err));
        });
    });
}
