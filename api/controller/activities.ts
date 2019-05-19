import { Response } from 'express';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import {
    getAllActivityRecordsforGovernmentOrCampaignAsync,
    IGetActivityRecordsForGovernmentOrCampaign
} from '../services/activityService';


export async function activities(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const body: IGetActivityRecordsForGovernmentOrCampaign = request.body;
        body.currentUserId = request.currentUser.id;
        const records = await getAllActivityRecordsforGovernmentOrCampaignAsync(body);
        response.status(200).json(records);
    } catch (err) {
        return response.status(422).json({message: err.message});
    }
}
