import { decipherJWTokenAsync, IToken } from '../services/permissionService';
import { Request } from 'express';

export interface IRequest extends Request {
    currentUser?: IToken;
    params: {
        id?: string;
    };
}

export async function getCurrentUser(req: IRequest, res, next) {
    if (req.cookies && req.cookies.token) {
        try {
            req.currentUser = await decipherJWTokenAsync(req.cookies.token);
            next();
        } catch (e) {
            res.status(401);
            res.clearCookie('token');
            return res.send({message: 'Token expired or incorrect'});
        }
    } else {
        next();
    }
}


export function checkCurrentUser(req: IRequest) {
    if (!req.currentUser) {
        throw new Error('No token set');
    }
}
