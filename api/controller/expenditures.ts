import { Response } from 'express';
import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { IAddExpenditureAttrs, addExpenditureAsync } from '../services/expenditureService';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { checkDto } from './helpers';
import { ExpenditureStatus, ExpenditureType, ExpenditureSubType, PayeeType } from '../models/entity/Expenditure';

export class AddExpenditureDto implements IAddExpenditureAttrs {
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
    description: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    zip: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsEnum(PayeeType)
    @IsOptional()
    payeeType: PayeeType;

    @IsEnum(ExpenditureSubType)
    @IsOptional()
    subType: ExpenditureSubType;

    @IsEnum(ExpenditureStatus)
    @IsOptional()
    status: ExpenditureStatus;

    @IsEnum(ExpenditureType)
    @IsOptional()
    type: ExpenditureType;

    @IsNumber()
    date: number;
}

export async function addExpenditure(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const addExpenditureDto = Object.assign(new AddExpenditureDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(addExpenditureDto);
        const expenditure = await addExpenditureAsync(addExpenditureDto);
        return response.status(201).json(expenditure);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
