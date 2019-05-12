import { Request, Response } from 'express';
import { createUserSessionFromLoginAsync } from '../services/userService';
import { decipherJWTokenAsync } from '../services/permissionService';

export async function login(request: Request, response: Response, next: Function) {
    try {
        const token = await createUserSessionFromLoginAsync(request.body.email, request.body.password);
        const tokenObj = await decipherJWTokenAsync(token);
        response.cookie('token', token, { expires: new Date(tokenObj.exp)} );
        return response.status(204).json({});
    } catch (err) {
        return response.status(401).json({message: 'No user found with email or password'});
    }
}

export async function invite(request: Request, response: Response, next: Function) {
    try {
        const token = await createUserSessionFromLoginAsync(request.body.email, request.body.password);
        const tokenObj = await decipherJWTokenAsync(token);
        response.cookie('token', token, { expires: new Date(tokenObj.exp)} );
        return response.status(204).json({});
    } catch (err) {
        return response.status(401).json({message: 'No user found with email or password'});
    }
}
