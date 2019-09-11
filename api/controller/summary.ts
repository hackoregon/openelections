import { Response } from 'express';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import {
    getStatusSummary,
} from '../services/campaignService';
import { bugsnagClient } from '../services/bugsnagService';

export async function getSummary(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);

        request.body.currentUserId = request.currentUser.id;

        const records = await getStatusSummary(request.body);
        response.status(200).json(records);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}
