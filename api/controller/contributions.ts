import {
    IUpdateContributionAttrs,
    updateContributionAsync,
    IGetContributionAttrs,
    getContributionsAsync,
    IAddContributionAttrs,
    addContributionAsync,
    getContributionByIdAsync,
    archiveContributionAsync,
    createContributionCommentAsync,
    getMatchResultAsync,
    updateMatchResultAsync,
    getContributionsGeoAsync,
    getVerificationErrorsAsync,
} from '../services/contributionService';
import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { checkCurrentUser, IRequest } from '../routes/helpers';
import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { IBulkUploadCSV, BulkUploadVerified, checkDto, parseBulkCsvData } from './helpers';
import {
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    InKindDescriptionType,
    MatchStrength,
    OaeType,
    PaymentMethod,
    PhoneType,
} from '../models/entity/Contribution';
import { bugsnagClient } from '../services/bugsnagService';

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

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod: PaymentMethod;

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

    @IsString()
    @IsOptional()
    phone: string;

    @IsNumber()
    @IsOptional()
    occupationLetterDate: number;

    @IsString()
    @IsOptional()
    occupation: string;

    @IsString()
    @IsOptional()
    employerName: string;

    @IsString()
    @IsOptional()
    employerCity: string;

    @IsString()
    @IsOptional()
    employerState: string;

    @IsString()
    @IsOptional()
    employerCountry: string;

    @IsString()
    @IsOptional()
    phoneType: string;

    @IsString()
    @IsOptional()
    checkNumber: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsBoolean()
    @IsOptional()
    compliant: boolean;
}

export async function updateContribution(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const updateContributionDto = Object.assign(new UpdateContributionDto(), {
            ...request.body,
            currentUserId: request.currentUser.id,
        });
        await checkDto(updateContributionDto);
        const contribution = await updateContributionAsync(updateContributionDto);
        return response.status(204).send(contribution);
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
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
    matchId?: string;

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

    @IsOptional()
    @IsString()
    format?: 'csv' | 'json' | 'geoJson' | 'xml';
}

export async function getContributions(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getContributionsDto = Object.assign(new GetContributionsDto(), {
            ...request.body,
            currentUserId: request.currentUser.id,
        });
        await checkDto(getContributionsDto);
        const contributions = await getContributionsAsync(getContributionsDto);
        if (contributions.csv) {
            response.type('text/csv');
            response.attachment('download-contributions-' + Date.now() + '.csv');
            return response.status(200).send(Buffer.from(contributions.csv));
        } else if (contributions.xml) {
            response.type('application/json');
            return response.status(200).send(Buffer.from(contributions.xml));
        }
        return response.status(200).send(JSON.stringify(contributions));
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }
}
export class BulkAddContributionDto {
    @IsNumber()
    currentUserId: number;

    @IsNumber()
    governmentId: number;

    @IsNumber()
    @IsOptional()
    campaignId: number;
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

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod: PaymentMethod;

    @IsNumber()
    date: number;

    @IsString()
    @IsOptional()
    phone: string;

    @IsNumber()
    @IsOptional()
    occupationLetterDate: number;

    @IsString()
    @IsOptional()
    occupation: string;

    @IsString()
    @IsOptional()
    employerName: string;

    @IsString()
    @IsOptional()
    employerCity: string;

    @IsString()
    @IsOptional()
    employerState: string;

    @IsString()
    @IsOptional()
    employerCountry: string;

    @IsEnum(PhoneType)
    @IsOptional()
    phoneType: PhoneType;

    @IsString()
    @IsOptional()
    checkNumber: string;

    @IsString()
    @IsOptional()
    notes: string;
}

export async function addContribution(request: IRequest, response: Response, _next: Function) {
    try {
        checkCurrentUser(request);
        const addContributionDto = Object.assign(new AddContributionDto(), {
            ...request.body,
            currentUserId: request.currentUser.id,
        });
        await checkDto(addContributionDto);
        const contribution = await addContributionAsync(addContributionDto);
        return response.status(201).json(contribution);
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }
}

export async function bulkAddContributions(request: IRequest, response: Response, _next: Function) {
    let csvData: BulkUploadVerified;
    try {
        csvData = await parseBulkCsvData(request.body, request.files);
    } catch (error) {
        console.log(error);
        return response.status(422).json({ message: 'An unknown error occurred parsing csv.' });
    }

    if (!csvData) {
        return response.status(422).json({ message: 'There was an issue parsing the csv.' });
    }

    // verify there are no errors in the csv.
    const vettedContributions: AddContributionDto[] = [];
    try {
        checkCurrentUser(request);
        const bulkContributionInfoDto = Object.assign(new BulkAddContributionDto(), {
            currentUserId: request.currentUser.id,
            ...csvData.info,
        });
        await checkDto(bulkContributionInfoDto);
        const contributionErrors = [];

        await Promise.all(
            csvData.contributions.map(async (contribution: Partial<IAddContributionAttrs>, index: number) => {
                try {
                    const addContributionDto = Object.assign(new AddContributionDto(), {
                        ...csvData.info,
                        ...contribution,
                    });
                    await checkDto(addContributionDto);
                    const errorString = await getVerificationErrorsAsync(addContributionDto);
                    if (errorString) {
                        contributionErrors.push(`Row ${index + 1}: ${errorString}`);
                    } else {
                        vettedContributions.push(addContributionDto);
                    }
                } catch (error) {
                    console.log({ error });
                    contributionErrors.push(`Row ${index + 1}: ${error.message}`);
                }
            })
        );

        if (contributionErrors.length) {
            let message = `Many issues were discoverd in the csv file. Please fix the errors and try again.`;
            if (contributionErrors.length === 1) {
                message = 'One row had an issue in the csv file. Please fix the errors and try again.';
            }
            const errorResponse = { message: message, issues: contributionErrors };
            return response.status(422).json(errorResponse);
        }
    } catch (err) {
        console.log('bulk add contributions error: ', err);
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }

    // Add csv rows if all checks pass
    try {
        const savedContributions = [];
        const contributionErrors = [];
        await Promise.all(
            vettedContributions.map(async (addContributionDto, index: number) => {
                try {
                    console.log('SAVING . . .');
                    const savedContribution = await addContributionAsync(addContributionDto);
                    savedContributions.push(savedContribution);
                } catch (error) {
                    console.log({ error });
                    contributionErrors.push(`Row ${index + 1}: ${error.message}`);
                }
            })
        );
        if (contributionErrors.length) {
            let message = `Many issues were discoverd in the csv file. Please fix the errors and try again.`;
            if (contributionErrors.length === 1) {
                message = 'One row had an issue in the csv file. Please fix the errors and try again.';
            }
            const errorResponse = { message: message, issues: contributionErrors };
            return response.status(422).json(errorResponse);
        }
        return response.status(200).json({
            message: `Successfully added ${savedContributions.length} contributions`,
            contributions: savedContributions,
        });
    } catch (error) {
        console.log('bulk add contributions error: ', error);
        if (process.env.NODE_ENV === 'production' && error.message !== 'No token set') {
            bugsnagClient.notify(error);
        }
        return response.status(422).json({ message: error.message });
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
            currentUserId: request.currentUser.id,
        });
        await checkDto(getContributionByIdDto);
        const contribution = await getContributionByIdAsync(getContributionByIdDto);
        return response.status(200).send(contribution);
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
            currentUserId: request.currentUser.id,
        });
        await checkDto(archiveContributionDto);
        const contribution = await archiveContributionAsync(archiveContributionDto);
        return response.status(200).json(contribution);
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }
}

export class ContributionCommentDto {
    currentUserId: number;

    @IsNumber()
    contributionId: number;

    @IsString()
    comment: string;

    @IsOptional()
    attachmentPath: UploadedFile;
}

export async function createContributionComment(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const attrs: any = {
            contributionId: parseInt(request.params.id),
            currentUserId: request.currentUser.id,
            comment: request.body.comment,
        };
        let file;
        if (request.files && request.files.attachment) {
            file = request.files.attachment;
            if (file.truncated) {
                throw new Error('File is over 10MB limit');
            }
            attrs.attachmentPath = file;
        }

        const contributionCommentDto = Object.assign(new ContributionCommentDto(), attrs);
        await checkDto(contributionCommentDto);
        const comment = await createContributionCommentAsync(contributionCommentDto);
        return response.status(204).json(comment);
    } catch (err) {
        if (process.env.NODE_ENV === 'production' && err.message !== 'No token set') {
            bugsnagClient.notify(err);
        }
        return response.status(422).json({ message: err.message });
    }
}

export class GetContributionMatchesDto {
    @IsNumber()
    currentUserId: number;

    @IsNumber()
    contributionId: number;
}

export async function getMatchesByContributionId(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const getContributionMatchesDto = Object.assign(new GetContributionMatchesDto(), {
            contributionId: parseInt(request.params.id),
            currentUserId: request.currentUser.id,
        });
        await checkDto(getContributionMatchesDto);
        console.log('passing this far');
        const matches = await getMatchResultAsync(getContributionMatchesDto);
        return response.status(200).send(matches);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export class PostMatchResultDTO {
    @IsNumber()
    currentUserId: number;

    @IsString()
    matchStrength: MatchStrength;

    @IsString()
    matchId: string;

    @IsNumber()
    contributionId: number;
}

export async function postMatchResult(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const PostMatchResult = Object.assign(new PostMatchResultDTO(), {
            contributionId: parseInt(request.body.contributionId),
            currentUserId: request.currentUser.id,
            matchStrength: request.body.matchStrength,
            matchId: request.body.matchId,
        });
        await checkDto(PostMatchResult);
        const matches = await updateMatchResultAsync(PostMatchResult);
        return response.status(200).send(matches);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}

export async function getContributionsGeo(request: IRequest, response: Response, next: Function) {
    try {
        const contributions = await getContributionsGeoAsync({ from: request.query.from, to: request.query.to });
        return response.status(200).send(contributions);
    } catch (err) {
        return response.status(422).json({ message: err.message });
    }
}
