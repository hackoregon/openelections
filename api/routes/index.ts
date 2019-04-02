import { userGetAllAction, userGetByIdAction, userSignUp, userLogin } from '../controller/users';

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
    },
    {
        path: '/signup',
        method: 'post',
        action: userSignUp
    },
    {
        path: '/login',
        method: 'post',
        action: userLogin
    }
];
