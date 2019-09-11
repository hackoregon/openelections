import { Response } from 'express';
import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import {
    IAddExpenditureAttrs,
    addExpenditureAsync,
    IGetExpenditureAttrs,
    getExpendituresAsync,
    IUpdateExpenditureAttrs,
    updateExpenditureAsync, createExpenditureCommentAsync, getExpenditureByIdAsync
} from '../services/expenditureService';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { checkDto } from './helpers';
import {
    ExpenditureStatus,
    ExpenditureType,
    ExpenditureSubType,
    PayeeType,
    PurposeType
} from '../models/entity/Expenditure';
import { PaymentMethod } from '../models/entity/Expenditure';
import { bugsnagClient } from '../services/bugsnagService';

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

    @IsEnum(ExpenditureType)
    @IsOptional()
    type: ExpenditureType;

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod: PaymentMethod;

    @IsEnum(PurposeType)
    @IsOptional()
    purpose: PurposeType;

    @IsNumber()
    date: number;

    @IsString()
    @IsOptional()
    checkNumber: string;
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
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export class GetExpendituresDto implements IGetExpenditureAttrs {
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

export async function getExpenditures(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getExpendituresDto = Object.assign(new GetExpendituresDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(getExpendituresDto);
        const expenditures = await getExpendituresAsync(getExpendituresDto);
        return response.status(200).send(expenditures);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export class UpdateExpenditureDto implements IUpdateExpenditureAttrs {
    @IsNumber()
    id: number;

    @IsNumber()
    currentUserId: number;

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
    @IsOptional()
    date: number;

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    checkNumber: string;
}

export async function updateExpenditure(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const updateExpenditureDto = Object.assign(new UpdateExpenditureDto(), {
            ...request.body,
            currentUserId: request.currentUser.id
        });
        await checkDto(updateExpenditureDto);
        const expenditure = await updateExpenditureAsync(updateExpenditureDto);

        return response.status(204).send(expenditure);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}

export class ExpenditureCommentDto {

    currentUserId: number;

    @IsNumber()
    expenditureId: number;

    @IsString()
    comment: string;

}

export async function createExpenditureComment(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const expenditureCommentDto = Object.assign(new ExpenditureCommentDto(), {
            expenditureId: parseInt(request.params.id),
            currentUserId: request.currentUser.id,
            comment: request.body.comment
        });
        await checkDto(expenditureCommentDto);
        const comment = await createExpenditureCommentAsync(expenditureCommentDto);
        return response.status(204).json(comment);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({message: err.message});
    }
}


export class GetExpenditureByIdDto {

    @IsNumber()
    expenditureId: number;

    @IsNumber()
    currentUserId: number;
}

export async function getExpenditureById(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getExpenditureByIdDto = Object.assign(new GetExpenditureByIdDto(), {
            expenditureId: parseInt(request.params.id),
            currentUserId: request.currentUser.id
        });
        await checkDto(getExpenditureByIdDto);
        const expenditure = await getExpenditureByIdAsync(getExpenditureByIdDto);
        return response.status(200).json(expenditure);
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }
}
