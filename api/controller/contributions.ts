import {
    IUpdateContributionAttrs,
    updateContributionAsync,
    IGetContributionAttrs,
    getContributionsAsync,
    IAddContributionAttrs,
    addContributionAsync,
    getContributionByIdAsync, archiveContributionAsync, createContributionCommentAsync
} from '../services/contributionService';
import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { Response } from 'express';
import { checkDto } from './helpers';
import {
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType, InKindDescriptionType, OaeType
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

    @IsEnum(OaeType)
    @IsOptional()
    oaeType: OaeType;

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

    @IsBoolean()
    @IsOptional()
    submitForMatch: boolean;

    @IsEnum(ContributionSubType)
    @IsOptional()
    subType: ContributionSubType;

    @IsEnum(InKindDescriptionType)
    @IsOptional()
    inKindType: InKindDescriptionType;

    @IsEnum(ContributionType)
    @IsOptional()
    type: ContributionType;

    @IsEnum(OaeType)
    @IsOptional()
    oaeType: OaeType;

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
        return response.status(201).json(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class GetContributionByIdDto {

    @IsNumber()
    contributionId: number;

    @IsNumber()
    currentUserId: number;
}

export async function getContributionById(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getContributionByIdDto = Object.assign(new GetContributionByIdDto(), {
            contributionId: parseInt(request.params.id),
            currentUserId: request.currentUser.id
        });
        await checkDto(getContributionByIdDto);
        const contribution = await getContributionByIdAsync(getContributionByIdDto);
        return response.status(200).json(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class ArchiveContributionDto {

    @IsNumber()
    currentUserId: number;

    @IsNumber()
    contributionId: number;

}

export async function archiveContribution(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const archiveContributionDto = Object.assign(new ArchiveContributionDto(), {
            contributionId: parseInt(request.params.id),
            currentUserId: request.currentUser.id
        });
        await checkDto(archiveContributionDto);
        const contribution = await archiveContributionAsync(archiveContributionDto);
        return response.status(200).json(contribution);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class ContributionCommentDto {

    currentUserId: number;

    @IsNumber()
    contributionId: number;

    @IsString()
    comment: string;

}

export async function createContributionComment(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const contributionCommentDto = Object.assign(new ContributionCommentDto(), {
            contributionId: parseInt(request.params.id),
            currentUserId: request.currentUser.id,
            comment: request.body.comment
        });
        await checkDto(contributionCommentDto);
        const comment = await createContributionCommentAsync(contributionCommentDto);
        return response.status(204).json(comment);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
