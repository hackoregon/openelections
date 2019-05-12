import { login } from '../controller/users';
import * as express from 'express';


export function setupRoutes(app: express.Express): void {
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: express.Request, response: express.Response, next: Function) => {
            route.action(request, response, next)
                .then(() => next)
                .catch(err => next(err));
        });
    });
}
/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: '/users/login',
        method: 'post',
        action: login
    }
];
