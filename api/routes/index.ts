import { userGetAllAction, userGetByIdAction } from '../controller/users';

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: '/users',
        method: 'get',
        action: userGetAllAction
    },
    {
        path: '/users/:id',
        method: 'get',
        action: userGetByIdAction
    }
];
