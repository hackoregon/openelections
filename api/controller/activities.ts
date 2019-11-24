import { Response } from 'express';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import {
    getActivityAttachmentAsync,
    getAllActivityRecordsAsync,
} from '../services/activityService';
import { bugsnagClient } from '../services/bugsnagService';
import { IsNumber } from 'class-validator';
import { checkDto } from './helpers';

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

export class GetActivityAttachmentDto {
    @IsNumber()
    currentUserId: number;

    @IsNumber()
    activityId: number;
}

export async function getActivityAttachment(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getActivityFileDto = Object.assign(new GetActivityAttachmentDto(), {
            activityId: parseInt(request.params.id),
            currentUserId: request.currentUser.id
        });
        await checkDto(getActivityFileDto);
        const data = await getActivityAttachmentAsync(getActivityFileDto);
        return response.status(200).send(data);
    } catch (err) {
        return response.status(422).json({message: err.message});
    }
}
