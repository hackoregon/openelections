import {
    IUpdateContributionAttrs,
    updateContributionAsync,
    IGetContributionAttrs,
    getContributionsAsync,
    IAddContributionAttrs,
    addContributionAsync,
    IGetContributionByIdAttrs,
    getContributionByIdAsync
} from '../services/contributionService';
import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean, IsBooleanString } from 'class-validator';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { Response } from 'express';
import { checkDto } from './helpers';
import {
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType
} from '../models/entity/Contribution';

export class UpdateContributionDto implements IUpdateContributionAttrs {
    @IsNumber()
    currentUserId: number;

    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    address1: string;

    @IsString()
    @IsOptional()
    address2: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    zip: string;

    @IsEnum(ContributorType)
    @IsOptional()
    contributorType: ContributorType;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    middleInitial: string;

    @IsNumber()
    @IsOptional()
    matchAmount: number;

    @IsNumber()
    @IsOptional()
    date: number;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    prefix: string;

    @IsString()
    @IsOptional()
    suffix: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsEnum(ContributionStatus)
    @IsOptional()
    status: ContributionStatus;

    @IsBoolean()
    @IsOptional()
    submitForMatch: boolean;

    @IsEnum(ContributionSubType)
    @IsOptional()
    subType: ContributionSubType;

    @IsEnum(ContributionType)
    @IsOptional()
    type: ContributionType;
}

export async function updateContribution(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const updateContributionDto = Object.assign(new UpdateContributionDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(updateContributionDto);
        const contribution = await updateContributionAsync(updateContributionDto);
        return response.status(204).send(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class GetContributionsDto implements IGetContributionAttrs {
    @IsNumber()
    governmentId: number;

    @IsNumber()
    currentUserId: number;

    @IsOptional()
    @IsNumber()
    campaignId?: number;

    @IsOptional()
    @IsNumber()
    perPage?: number;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    from?: string;

    @IsOptional()
    @IsString()
    to?: string;
}

export async function getContributions(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getContributionsDto = Object.assign(new GetContributionsDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(getContributionsDto);
        const contributions = await getContributionsAsync(getContributionsDto);
        return response.status(200).send(contributions);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class AddContributionDto implements IAddContributionAttrs {
    @IsNumber()
    currentUserId: number;

    @IsNumber()
    governmentId: number;

    @IsNumber()
    @IsOptional()
    campaignId: number;

    @IsString()
    @IsOptional()
    address1: string;

    @IsString()
    @IsOptional()
    address2: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    zip: string;

    @IsEnum(ContributorType)
    @IsOptional()
    contributorType: ContributorType;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    middleInitial: string;

    @IsNumber()
    @IsOptional()
    matchAmount: number;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    prefix: string;

    @IsString()
    @IsOptional()
    suffix: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsEnum(ContributionStatus)
    @IsOptional()
    status: ContributionStatus.DRAFT | ContributionStatus.SUBMITTED;

    @IsBoolean()
    @IsOptional()
    submitForMatch: boolean;

    @IsEnum(ContributionSubType)
    @IsOptional()
    subType: ContributionSubType;

    @IsEnum(ContributionType)
    @IsOptional()
    type: ContributionType;

    @IsNumber()
    date: number;
}

export async function addContribution(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const addContributionDto = Object.assign(new AddContributionDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(addContributionDto);
        const contribution = await addContributionAsync(addContributionDto);
        return response.status(204).send(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class GetContributionByIdDto implements IGetContributionByIdAttrs {
    governmentId: number;
    contributionId: number;
    currentUserId?: number;
    campaignId?: number;
}

export async function getContributionById(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getContributionByIdDto = Object.assign(new GetContributionByIdDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(getContributionByIdDto);
        const contribution = await getContributionByIdAsync(getContributionByIdDto);
        return response.status(200).send(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
