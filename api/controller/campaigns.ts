import { Response } from 'express';
import { IsString, IsNumber } from 'class-validator';
import { checkDto } from './helpers';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { ICreateCampaign, IGetCampaigns, createCampaignAsync, getCampaignsAsync } from '../services/campaignService';

class CreateCampaignDto implements ICreateCampaign {
    @IsString()
    name: string;
    @IsNumber()
    governmentId: number;
    @IsNumber()
    currentUserId: number;

    email?: string;
    firstName?: string;
    lastName?: string;
    officeSought: string;
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

class GetCampaignsDto implements IGetCampaigns {
    @IsNumber()
    governmentId: number;
    @IsNumber()
    currentUserId: number;
}

export async function getCampaigns(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getCampaignsDto = Object.assign(new GetCampaignsDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(getCampaignsDto);
        const campaigns = await getCampaignsAsync(getCampaignsDto);
        return response.status(200).json(campaigns);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
