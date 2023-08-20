import { validate } from 'class-validator';
import { FileArray, UploadedFile } from 'express-fileupload';
import { createReadStream } from 'fs';
import * as parse from 'csv-parse/lib';
import { IAddContributionAttrs } from '../services/contributionService';
import { convertToTimeZone } from 'date-fns-timezone';

export async function checkDto(dto): Promise<void> {
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

// TODO: add parseBulkCsvData tests
export async function parseBulkCsvData(body: IBulkUploadBody, file: FileArray): Promise<BulkUploadVerified> {
    const { governmentId, campaignId, currentUserId, filename } = body;
    console.log('files', file);
    const parsedFiles = JSON.parse(JSON.stringify(file));
    console.log('parsedFiles', parsedFiles);
    const uploadPath = parsedFiles.file.tempFilePath;
    console.log({ uploadPath });

    const csvContributions: Partial<IAddContributionAttrs>[] = await new Promise((resolve, reject) => {
        const csvRowData: Partial<IAddContributionAttrs>[] = [];
        createReadStream(uploadPath)
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', (row: IBulkUploadCSV) => {
                const newRow: Partial<IAddContributionAttrs> = {};
                Object.keys(row || {}).forEach((rowItem) => {
                    if (row[rowItem] === '') {
                        // Don't add empty values to object
                        // delete row[rowItem];
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
                console.log('finished');
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
