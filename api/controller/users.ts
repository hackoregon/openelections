import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../models/entity/User';

/**
 * Loads all users from the database.
 */
export async function userGetAllAction(request: Request, response: Response) {
    const userManager = getManager().getRepository(User);

    const users = await userManager.find();

    // return loaded posts
    response.status(200);
    response.send({users});
}

export async function userGetByIdAction(request: Request, response: Response) {
    const userManager = getManager().getRepository(User);

    const user = await userManager.find(request.params.id);
    response.status(200);
    response.send({user});
}
