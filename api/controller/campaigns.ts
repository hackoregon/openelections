import { Request, Response } from 'express';
import { IsString, IsNumber } from 'class-validator';
import { checkDto } from './helpers';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { ICreateCampaign, createCampaignAsync } from '../services/campaignService';

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
        checkCurrentUser(request);
        const createCampaignDto = Object.assign(new CreateCampaignDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(createCampaignDto);
        const campaign = await createCampaignAsync(createCampaignDto);
        return response.status(201).send(campaign);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
