import { Request, Response } from 'express';
import {
    createUserSessionFromLoginAsync, generatePasswordResetAsync,
    IRetrieveUserParams,
    resendInvitationAsync,
    retrieveUserPermissionsAsync
} from '../services/userService';
import {
    addUserToCampaignAsync,
    addUserToGovernmentAsync,
    decipherJWTokenAsync,
    IAddUserCampaignAttrs,
    IAddUserGovAttrs
} from '../services/permissionService';
import { checkCurrentUser, IRequest } from '../routes/helpers';

export async function login(request: IRequest, response: Response, next: Function) {
    try {
        const token = await createUserSessionFromLoginAsync(request.body.email, request.body.password);
        const tokenObj = await decipherJWTokenAsync(token);
        response.cookie('token', token, { expires: new Date(tokenObj.exp)} );
        return response.status(204).json({});
    } catch (err) {
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
        return response.status(422).json({message: err.message});
    }
}

export async function resendInvite(request: IRequest, response: Response, next: Function) {
    try {
        await resendInvitationAsync(request.body.userId);
        response.status(200).send({});
    } catch (err) {
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
        return response.status(422).json({message: err.message});
    }
}

export async function sendPasswordReset(request: IRequest, response: Response, next: Function) {
    try {
        await generatePasswordResetAsync(request.body.email);
        response.status(200).send({});
    } catch (err) {
        return response.status(422).json({message: err.message});
    }
}
