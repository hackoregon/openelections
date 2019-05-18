import * as users from '../controller/users';
import * as express from 'express';
import { getCurrentUser, IRequest } from './helpers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Response } from 'express';
import * as activities from '../controller/activities';

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
        action: users.login
    },
    {
        path: '/users/invite',
        method: 'post',
        action: users.invite
    },
    {
        path: '/users/resend-invite',
        method: 'post',
        action: users.resendInvite
    },
    {
        path: '/users/redeem-invite',
        method: 'post',
        action: users.redeemInvite
    },
    {
        path: '/users',
        method: 'post',
        action: users.getUsers
    },
    {
        path: '/users/send-password-reset-email',
        method: 'post',
        action: users.sendPasswordReset
    },
    {
        path: '/users/reset-password',
        method: 'post',
        action: users.resetPassword
    },
    {
        path: '/users/password',
        method: 'put',
        action: users.updatePassword
    },
    {
        path: '/activities',
        method: 'post',
        action: activities.activities
    }
];

export const setupRoutes = (app: express.Express) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(getCurrentUser);
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: IRequest, response: express.Response, next: Function) => {
            route.action(request, response, next).then(() => next).catch(err => next(err));
        });
    });
};
