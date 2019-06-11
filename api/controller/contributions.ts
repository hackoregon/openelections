import { IUpdateContributionAttrs, updateContributionAsync } from '../services/contributionService';
import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
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
