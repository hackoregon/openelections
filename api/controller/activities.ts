import { Response } from 'express';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import {
    getAllActivityRecordsAsync,
} from '../services/activityService';
import { bugsnagClient } from '../services/bugsnagService';

export async function getActivities(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);

        request.body.currentUserId = request.currentUser.id;

        const records = await getAllActivityRecordsAsync(request.body);
        response.status(200).json(records);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}
