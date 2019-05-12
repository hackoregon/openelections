import { Request, Response } from 'express';

export async function login(request: Request, response: Response, next: Function) {
    try {
        return response.send(JSON.stringify('No User!'));
    } catch (err) {
        return next(err);
    }
}
