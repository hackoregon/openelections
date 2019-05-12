import { decipherJWTokenAsync } from '../services/permissionService';

export async function getCurrentUser(req, res, next) {
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
