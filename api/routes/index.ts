import { login } from '../controller/users';

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
