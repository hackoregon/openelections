import {
    Activity,
    ActivityTypeEnum,
    getActivityByCampaignAsync,
    getActivityByCampaignByTimeAsync,
    getActivityByContributionAsync,
    getActivityByExpenditureAsync,
    getActivityByGovernmentAsync,
    IActivityResults,
    IShortActivityResult,
} from '../models/entity/Activity';
import { Government } from '../models/entity/Government';
import { User } from '../models/entity/User';
import { Campaign } from '../models/entity/Campaign';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import db from '../models/db';

export interface ICreateActivityServiceParams {
    currentUser: User;
    government?: Government;
    campaign?: Campaign;
    activityId: number;
    activityType: ActivityTypeEnum;
    notes: string;
    notify?: boolean;
    attachmentPath?: string;
}

export async function createActivityRecordAsync(params: ICreateActivityServiceParams): Promise<Activity> {
    const dataSource = await db();
    const repository = dataSource.getRepository('Activity');
    let activity = new Activity();
    activity.user = params.currentUser;
    activity.government = params.government;
    activity.campaign = params.campaign;
    activity.activityId = params.activityId;
    activity.activityType = params.activityType;
    activity.notes = params.notes;
    activity.notify = !!params.notify;
    activity.attachmentPath = params.attachmentPath;
    if (await activity.isValidAsync()) {
        activity = await repository.save(activity);
        return activity;
    }
    throw new Error(`Invalid activity ${activity.errors}`);
}

export interface IGetActivityRecords {
    currentUserId: number;
    governmentId?: number; // get all activities by government, requires government admin
    campaignId?: number; // get all activities by government, requires government admin, campaign admin or staff
    contributionId?: number; // get all activities by contribution, includes comments
    expenditureId?: number; // get all activities by expenditures
    perPage?: number;
    page?: number;
}

export async function getAllActivityRecordsAsync(
    params: IGetActivityRecords,
    hostName: string
): Promise<IActivityResults> {
    const perPage = params.perPage || 100;
    const page = params.page || 0;

    if (params.governmentId) {
        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, params.governmentId);
        if (hasGovAdminPermissions) {
            return getActivityByGovernmentAsync(params.governmentId, perPage, page, hostName);
        }
    }

    if (params.campaignId) {
        const dataSource = await db();
        const campaignRepository = dataSource.getRepository('Campaign');

        const campaign = await campaignRepository.findOneOrFail({
            where: { id: params.campaignId },
            relations: ['government'],
        });

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, campaign.government.id);
        const hasCampaignAdminPermissions =
            hasGovAdminPermissions || (await isCampaignAdminAsync(params.currentUserId, params.campaignId));
        const hasCampaignStaffPermissions =
            hasCampaignAdminPermissions || (await isCampaignStaffAsync(params.currentUserId, params.campaignId));

        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByCampaignAsync(params.campaignId, perPage, page, hostName);
        }
    }

    if (params.contributionId) {
        const dataSource = await db();
        const contributionRepository = dataSource.getRepository('Contribution');

        const contribution = await contributionRepository.findOneOrFail({
            where: { id: params.contributionId },
            relations: ['government', 'campaign'],
        });

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, contribution.government.id);
        const hasCampaignAdminPermissions =
            hasGovAdminPermissions || (await isCampaignAdminAsync(params.currentUserId, contribution.campaign.id));
        const hasCampaignStaffPermissions =
            hasCampaignAdminPermissions || (await isCampaignStaffAsync(params.currentUserId, contribution.campaign.id));

        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByContributionAsync(params.contributionId, perPage, page, hostName);
        }
    }

    if (params.expenditureId) {
        const dataSource = await db();
        const expenditureRepository = dataSource.getRepository('Expenditure');

        const expenditure = await expenditureRepository.findOneOrFail({
            where: { id: params.expenditureId },
            relations: ['government', 'campaign'],
        });

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, expenditure.government.id);
        const hasCampaignAdminPermissions =
            hasGovAdminPermissions || (await isCampaignAdminAsync(params.currentUserId, expenditure.campaign.id));
        const hasCampaignStaffPermissions =
            hasCampaignAdminPermissions || (await isCampaignStaffAsync(params.currentUserId, expenditure.campaign.id));

        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByExpenditureAsync(params.expenditureId, perPage, page, hostName);
        }
    }

    return {
        total: 0,
        perPage,
        page,
        data: [],
    };
}

export interface IGetActivityRecordsForEmails {
    campaignId: number;
    from: Date;
    to: Date;
}

export async function getActivityRecordsForEmailsAsync(
    params: IGetActivityRecordsForEmails
): Promise<IShortActivityResult[]> {
    return await getActivityByCampaignByTimeAsync(params.campaignId, params.from, params.to);
}

export interface IGetActivityAttachment {
    currentUserId: number;
    activityId: number;
}

export async function getActivityAttachmentAsync(
    params: IGetActivityAttachment
): Promise<{ contentType: string; buffer: Buffer; fileName?: string }> {
    const dataSource = await db();
    const activityRepository = dataSource.getRepository('Activity');

    const activity = await activityRepository.findOneOrFail({
        where: { id: params.activityId },
        relations: ['campaign', 'government'],
    });

    const isGovernmentAdmin = await isGovernmentAdminAsync(params.currentUserId, activity.government.id);
    let isCampaignAdmin = false;
    let isCampaignStaff = false;

    if (activity.campaign && !isGovernmentAdmin) {
        isCampaignAdmin = await isCampaignAdminAsync(params.currentUserId, activity.campaign.id);
        isCampaignStaff = await isCampaignStaffAsync(params.currentUserId, activity.campaign.id);
    }
    if (!isCampaignAdmin && !isGovernmentAdmin && !isCampaignStaff) {
        throw new Error('User does not have permissions');
    }

    if (activity.attachmentPath) {
        return getFileAttachmentAsync(activity.attachmentPath);
    }
}

export async function getFileAttachmentAsync(
    filePath: string
): Promise<{ contentType: string; buffer: Buffer; fileName?: string }> {
    // if (process.env.APP_ENV === 'development' || process.env.NODE_ENV === 'test') {
    //     return(
    //         Promise.resolve({
    //             contentType: 'application/txt',
    //             buffer: fs.readFileSync(filePath)
    //         })
    //     );
    // }

    let key = new URL(filePath).pathname;
    key = key.substr(1);
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const data = await s3.getObject({ Bucket: 'open-elections', Key: key }).promise();
    const fileNameArray = key.split('/');
    const fileName = fileNameArray[fileNameArray.length - 1];

    return { contentType: data.ContentType, buffer: data.Body, fileName };
}

export async function saveFileAttachmentAsync(
    id: number,
    type: 'expenditures' | 'contributions',
    fileName: string,
    filePath: string
): Promise<string> {
    // if (process.env.APP_ENV === 'development' || process.env.NODE_ENV === 'test') {
    //     return Promise.resolve(filePath);
    // }

    let folder = 'production-uploads';
    // if (process.env.APP_ENV === 'staging') {
    folder = 'qa-uploads';
    // }
    if (
        !process.env.AWS_ACCESS_KEY_ID ||
        !process.env.AWS_SECRET_ACCESS_KEY ||
        !process.env.AWS_DEFAULT_REGION ||
        !process.env.HOST_URL
    ) {
        throw new Error('The API needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY passed in as env variables');
    }

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const uploadParams = { Bucket: 'open-elections', Key: '', Body: '' };

    const fs = require('fs');
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = `${folder}/${type}/${id}/${fileName}`;

    return new Promise((res, rej) => {
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                rej(err);
            }
            if (data) {
                res(data.Location);
            }
        });
    });
}
