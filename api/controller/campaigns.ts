import { Request, Response } from 'express';
import { IsString, IsNumber } from 'class-validator';
import { checkDto } from './helpers';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { ICreateCampaign } from '../services/campaignService';

class CreateCampaignDto implements ICreateCampaign {
    @IsString()
    name: string;
    @IsNumber()
    governmentId: number;
    @IsNumber()
    currentUserId: number;
}

export async function addCampaign(request: IRequest, response: Response, next: Function) {
    try {
        const createCampaignDto = Object.assign(new CreateCampaignDto(), request.body);
        await Promise.all([checkCurrentUser(request), checkDto(createCampaignDto)]);
        return response.status(204).send({});
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
