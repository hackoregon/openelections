import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { getCurrentUser, IRequest } from './helpers';
import {
    login,
    invite,
    resendInvite,
    getUsers,
    sendPasswordReset,
    resetPassword,
    updatePassword,
    redeemInvite
} from '../controller/users';
import * as campaigns from '../controller/campaigns';

export const AppRoutes = [
    {
        path: '/me',
        method: 'get',
        action: async (request: IRequest, response: express.Response) => {
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
    {
        path: '/users/resend-invite',
        method: 'post',
        action: resendInvite
    },
    {
        path: '/users/redeem-invite',
        method: 'post',
        action: redeemInvite
    },
    {
        path: '/users',
        method: 'post',
        action: getUsers
    },
    {
        path: '/users/send-password-reset-email',
        method: 'post',
        action: sendPasswordReset
    },
    {
        path: '/users/reset-password',
        method: 'post',
        action: resetPassword
    },
    {
        path: '/users/password',
        method: 'put',
        action: updatePassword
    },
    {
        path: '/campaigns/new',
        method: 'post',
        action: campaigns.addCampaign
    }
];

export const setupRoutes = (app: express.Express) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(getCurrentUser);
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: IRequest, response: express.Response, next: Function) => {
            route
                .action(request, response, next)
                .then(() => next)
                .catch(err => next(err));
        });
    });
};
