import { validate } from 'class-validator';
import { FileArray } from 'express-fileupload';
import { createReadStream } from 'fs';
import * as parse from 'csv-parse/lib';
import { IAddContributionAttrs } from '../services/contributionService';
import { convertToTimeZone } from 'date-fns-timezone';
import {
    ContributionSubType,
    ContributionType,
    ContributorType,
    InKindDescriptionType,
    OaeType,
    PhoneType,
} from '../models/entity/Contribution';

export async function checkDto(dto): Promise<void> {
    console.log('from checkDto');
    const validationErrors = await validate(dto, { validationError: { target: false } });
    if (validationErrors.length) {
        throw new Error(
            validationErrors
                .map((validationError) =>
                    Object.keys(validationError.constraints).map((key) => validationError.constraints[key])
                )
                .join(', ')
        );
    }
}

export async function checkDtoWithEnums(dto): Promise<void> {
    console.log('from checkDtoWithEnums');
    const validationErrors = await validate(dto, { validationError: { target: false } });
    if (validationErrors.length) {
        throw new Error(
            validationErrors
                .map((validationError) =>
                    Object.keys(validationError.constraints).map((key) => {
                        const keyError = validationError.constraints[key];
                        if (key === 'isEnum' && keyError.includes('must be a valid enum value')) {
                            if (validationError.property === 'subType') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(ContributionSubType)
                                        .map((key) => ContributionSubType[key])
                                        .join(', ')
                                );
                            } else if (validationError.property === 'inKindType') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(InKindDescriptionType)
                                        .map((key) => InKindDescriptionType[key])
                                        .join(', ')
                                );
                            } else if (validationError.property === 'type') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(ContributionType)
                                        .map((key) => ContributionType[key])
                                        .join(', ')
                                );
                            } else if (validationError.property === 'oaeType') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(OaeType)
                                        .map((key) => OaeType[key])
                                        .join(', ')
                                );
                            } else if (validationError.property === 'contributorType') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(ContributorType)
                                        .map((key) => ContributorType[key])
                                        .join(', ')
                                );
                            } else if (validationError.property === 'phoneType') {
                                return (
                                    keyError +
                                    '. Enum must match one of the following: ' +
                                    Object.keys(PhoneType)
                                        .map((key) => PhoneType[key])
                                        .join(', ')
                                );
                            }
                        }
                        return keyError;
                    })
                )
                .join('. ')
        );
    }
}

interface IBulkUploadBody {
    governmentId: string;
    campaignId: string;
    currentUserId: string;
    filename: string;
}

export interface IBulkUploadCSV {
    governmentId?: number;
    campaignId?: number;
    currentUserId?: number;
    id?: string;
    amount?: string;
    createdAt?: string;
    updatedAt?: string;
    type?: string;
    subType?: string;
    inKindType?: string;
    contributorType?: string;
    oaeType?: string;
    contrPrefix?: string;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    suffix?: string;
    title?: string;
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    email?: string;
    phone?: string;
    phoneType?: string;
    checkNumber?: string;
    occupation?: string;
    employerName?: string;
    employerCity?: string;
    employerState?: string;
    employerCountry?: string;
    compliant?: string;
    matchAmount?: string;
    status?: string;
    notes?: string;
    paymentMethod?: string;
    date?: string;
    occupationLetterDate?: string;
    addressPoint?: string;
    campaignName?: string;
}

export type BulkUploadVerified = {
    info: {
        governmentId: number;
        campaignId: number;
        currentUserId: number;
        filename: string;
    };
    contributions: Partial<IAddContributionAttrs>[];
};
const acceptableColumnTitles = [
    'amount',
    'type',
    'subType',
    'inKindType',
    'contributorType',
    'oaeType',
    'contrPrefix',
    'firstName',
    'middleInitial',
    'lastName',
    'suffix',
    'title',
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'county',
    'email',
    'phone',
    'phoneType',
    'checkNumber',
    'occupation',
    'employerName',
    'employerCity',
    'employerState',
    'employerCountry',
    'notes',
    'paymentMethod',
    'date',
    'occupationLetterDate',
];
export async function parseBulkCsvData(body: IBulkUploadBody, file: FileArray): Promise<BulkUploadVerified> {
    const { governmentId, campaignId, currentUserId, filename } = body;
    const parsedFiles = JSON.parse(JSON.stringify(file));
    const uploadPath = parsedFiles.file.tempFilePath;

    const csvContributions: Partial<IAddContributionAttrs>[] = await new Promise((resolve, reject) => {
        const csvRowData: Partial<IAddContributionAttrs>[] = [];
        let runColumnCheck = true;
        createReadStream(uploadPath)
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', (row: IBulkUploadCSV) => {
                if (runColumnCheck) {
                    console.log('header row start');
                    const rowTitleErrors = [];
                    Object.keys(row || {}).forEach((rowItem) => {
                        if (!acceptableColumnTitles.includes(rowItem)) {
                            console.log(`${rowItem} should not be here.`);
                            rowTitleErrors.push(rowItem);
                        }
                    });
                    if (rowTitleErrors.length) {
                        let rowErrorString = 'Invalid column used: ' + rowTitleErrors[0];
                        if (rowTitleErrors.length > 1) {
                            rowErrorString = 'Invalid columns used: ' + rowTitleErrors.join(', ');
                        }
                        reject(new Error(`${rowErrorString}. Columns should be: ${acceptableColumnTitles.join(', ')}`));
                    }
                    console.log('header row end');
                    runColumnCheck = false;
                }
                const newRow: Partial<IAddContributionAttrs> = {};
                Object.keys(row || {}).forEach((rowItem) => {
                    if (row[rowItem] === '' || rowItem === 'status' || rowItem === 'matchAmount') {
                        // Don't add empty values to object
                        // delete row[rowItem];
                    } else if (rowItem === 'phoneType') {
                        const itemString = row[rowItem];
                        if (itemString) {
                            const firstChar = itemString.charAt(0).toUpperCase();
                            const remainingChars = itemString.slice(1);
                            newRow[rowItem] = `${firstChar}${remainingChars}` as PhoneType;
                        }
                    } else if (rowItem === 'contributorType') {
                        let itemString = row[rowItem];
                        if (itemString) {
                            itemString = itemString.toLowerCase().replace(/ /g, '_');
                            newRow[rowItem] = itemString as ContributorType;
                        }
                    } else if (rowItem === 'inKindType') {
                        let itemString = row[rowItem];
                        if (itemString) {
                            itemString = itemString.toLowerCase().replace(/ /g, '_');
                            newRow[rowItem] = itemString as InKindDescriptionType;
                        }
                    } else if (rowItem === 'amount') {
                        newRow[rowItem] = parseInt(row[rowItem]);
                    } else if (rowItem === 'date') {
                        newRow[rowItem] = dateToMicroTime(row[rowItem]);
                    } else {
                        newRow[rowItem] = row[rowItem];
                    }
                });
                csvRowData.push({
                    ...newRow,
                    governmentId: parseInt(governmentId),
                    campaignId: parseInt(campaignId),
                    currentUserId: parseInt(currentUserId),
                });
            })
            .on('end', function () {
                resolve(csvRowData);
            })
            .on('error', function (error) {
                console.log(error.message);
                reject(error.message);
            });
    });

    return {
        info: {
            governmentId: parseInt(governmentId),
            campaignId: parseInt(campaignId),
            currentUserId: parseInt(currentUserId),
            filename,
        },
        contributions: csvContributions,
    };
}

export function dateToMicroTime(formattedDate: string): number {
    return new Date(
        convertToTimeZone(formattedDate, {
            timeZone: 'America/Los_Angeles',
        })
    ).getTime();
}
