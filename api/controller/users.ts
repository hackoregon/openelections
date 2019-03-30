import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../models/entity/User';
import { createUserAsync } from '../services/UserService';
import * as passport from 'passport';

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
/**
 * Returns user by id from db
 */
export async function userGetByIdAction(request: Request, response: Response) {
    const userManager = getManager().getRepository(User);

    const user = await userManager.find(request.params.id);
    response.status(200);
    response.send({user});
}

/**
 * Accepts user data and creates new user
 */
export async function userSignUp(request: Request, response: Response) {
    const {firstName, lastName, email, password} = request.body;
    if (!email) {
        response.statusCode = 403;
        response.send(JSON.stringify('No email sent'));
    }
    if (!password) {
        response.statusCode = 403;
        response.send(JSON.stringify('No password sent'));
    }
    if (!firstName) {
        response.statusCode = 403;
        response.send(JSON.stringify('No first name sent'));
    }
    if (!lastName) {
        response.statusCode = 403;
        response.send(JSON.stringify('No last name sent'));
    }
    const userRepo = await getManager().getRepository(User);
    const existingUser = await userRepo.findOne({ email });


    response.setHeader('Content-Type', 'application/json');

    if (existingUser) {
        response.statusCode = 403;
        response.send(JSON.stringify('User already exists'));
    } else {
        createUserAsync({
            email,
            password,
            firstName,
            lastName
        }).then( user => {
            response.send(user.toJSON());
        });
    }
}

/**
 * Accepts user data and logs them in
 */
export async function userLogin(request: Request, response: Response, next: Function) {
    // TODO: add validation

    passport.authenticate('local', (err: Error, user, info) => {
        if (err) { return next(err); }
        if (!user) {
          return response.send(JSON.stringify('No User!'));
        }
        request.logIn( user, (err) => {
          if (err) { return next(err); }
          return response.send(JSON.stringify('User logged in!'));
        });
      })(request, response, next);
}