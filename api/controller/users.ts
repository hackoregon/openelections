import { Request, Response } from 'express';
import {
    acceptUserInvitationAsync,
    createUserSessionFromLoginAsync, generatePasswordResetAsync,
    IRetrieveUserParams, passwordResetAsync,
    resendInvitationAsync,
    retrieveUserPermissionsAsync, updateUserPasswordAsync
} from '../services/userService';
import {
    addUserToCampaignAsync,
    addUserToGovernmentAsync,
    decipherJWTokenAsync,
    IAddUserCampaignAttrs,
    IAddUserGovAttrs
} from '../services/permissionService';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { bugsnagClient } from '../services/bugsnagService';

export async function login(request: IRequest, response: Response, next: Function) {
    try {
        const token = await createUserSessionFromLoginAsync(request.body.email, request.body.password);
        const tokenObj = await decipherJWTokenAsync(token);
        let domain = process.env.NODE_ENV === 'production' ? 'openelectionsportland.org' : 'localhost';
        if (process.env.COOKIE_URL_TEST) {
            // for testsuite
            domain = process.env.COOKIE_URL_TEST;
        }

        response.cookie('token', token, { expires: new Date(tokenObj.exp), domain} );
        return response.status(204).json({});
    } catch (err) {
        console.log(err) // debug
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(401).json({message: 'No user found with email or password'});
    }
}

export async function invite(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        if (request.body.governmentId) {
            const body = request.body as IAddUserGovAttrs;
            body.currentUserId = request.currentUser.id;
            await addUserToGovernmentAsync(body);
            response.status(201).send({});
        } else if (request.body.campaignId) {
            const body = request.body as IAddUserCampaignAttrs;
            body.currentUserId = request.currentUser.id;
            await addUserToCampaignAsync(body);
            response.status(201).send({});
        } else {
            throw new Error('No government or campaign id present');
        }
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export async function redeemInvite(request: IRequest, response: Response, next: Function) {
    try {
        await acceptUserInvitationAsync({
            invitationCode: request.body.invitationCode as string,
            password: request.body.password as string,
            firstName: request.body.firstName,
            lastName: request.body.firstName,
        });
        return response.status(204).json({});
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}



export async function resendInvite(request: IRequest, response: Response, next: Function) {
    try {
        await resendInvitationAsync(request.body.userId);
        response.status(204).send({});
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export async function getUsers(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const body = request.body as IRetrieveUserParams;
        body.currentUserId = request.currentUser.id;
        const users = await retrieveUserPermissionsAsync(body);
        return response.status(200).json(users);
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export async function sendPasswordReset(request: IRequest, response: Response, next: Function) {
    try {
        await generatePasswordResetAsync(request.body.email);
        response.status(204).send({});
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export async function resetPassword(request: IRequest, response: Response, next: Function) {
    try {
        await passwordResetAsync(request.body.invitationCode, request.body.password);
        response.status(204).send({});
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export async function updatePassword(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const currentUserId = request.currentUser.id;
        await updateUserPasswordAsync(currentUserId, request.body.currentPassword, request.body.newPassword);
        return response.status(204).send({});
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

