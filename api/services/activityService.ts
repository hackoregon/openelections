import {
    Activity,
    ActivityTypeEnum,
    getActivityByCampaignAsync,
    getActivityByCampaignByTimeAsync,
    getActivityByContributionAsync,
    getActivityByExpenditureAsync,
    getActivityByGovernmentAsync,
    IActivityResult, IActivityResults, IShortActivityResult
} from '../models/entity/Activity';
import { getConnection } from 'typeorm';
import { Government } from '../models/entity/Government';
import { User } from '../models/entity/User';
import { Campaign } from '../models/entity/Campaign';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import { Contribution } from '../models/entity/Contribution';
import { Expenditure } from '../models/entity/Expenditure';

export interface ICreateActivityServiceParams {
    currentUser: User;
    government?: Government;
    campaign?: Campaign;
    activityId: number;
    activityType: ActivityTypeEnum;
    notes: string;
    notify?: boolean;
}

export async function createActivityRecordAsync(params: ICreateActivityServiceParams): Promise<Activity> {
    const repository = getConnection('default').getRepository('Activity');
    let activity = new Activity();
    activity.user = params.currentUser;
    activity.government = params.government;
    activity.campaign = params.campaign;
    activity.activityId = params.activityId;
    activity.activityType = params.activityType;
    activity.notes = params.notes;
    activity.notify = !!params.notify;
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
    expenditureId?: number;  // get all activities by expenditures
    perPage?: number;
    page?: number;
}

export async function getAllActivityRecordsAsync(params: IGetActivityRecords): Promise<IActivityResults> {

    const perPage = params.perPage || 100;
    const page = params.page || 0;

    if (params.governmentId) {
        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, params.governmentId);
        if (hasGovAdminPermissions) {
            return getActivityByGovernmentAsync(params.governmentId, perPage, page);
        }
    }

    if (params.campaignId) {
        const campaignRepository = getConnection('default').getRepository('Campaign');

        const campaign = (await campaignRepository.findOneOrFail(params.campaignId, {
            relations: ['government']
        })) as Campaign;

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, campaign.government.id);
        const hasCampaignAdminPermissions = hasGovAdminPermissions || await isCampaignAdminAsync(params.currentUserId, params.campaignId);
        const hasCampaignStaffPermissions = hasCampaignAdminPermissions || await isCampaignStaffAsync(params.currentUserId, params.campaignId);
        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByCampaignAsync(params.campaignId, perPage, page);
        }
    }

    if (params.contributionId) {
        const contributionRepository = getConnection('default').getRepository('Contribution');

        const contribution = (await contributionRepository.findOneOrFail(params.contributionId, {
            relations: ['government', 'campaign']
        })) as Contribution;

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, contribution.government.id);
        const hasCampaignAdminPermissions = hasGovAdminPermissions || await isCampaignAdminAsync(params.currentUserId, contribution.campaign.id);
        const hasCampaignStaffPermissions = hasCampaignAdminPermissions || await isCampaignStaffAsync(params.currentUserId, contribution.campaign.id);
        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByContributionAsync(params.contributionId, perPage, page);
        }
    }

    if (params.expenditureId) {
        const expenditureRepository = getConnection('default').getRepository('Expenditure');

        const expenditure = (await expenditureRepository.findOneOrFail(params.expenditureId, {
            relations: ['government', 'campaign']
        })) as Expenditure;

        const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, expenditure.government.id);
        const hasCampaignAdminPermissions = hasGovAdminPermissions || await isCampaignAdminAsync(params.currentUserId, expenditure.campaign.id);
        const hasCampaignStaffPermissions = hasCampaignAdminPermissions || await isCampaignStaffAsync(params.currentUserId, expenditure.campaign.id);

        if (hasGovAdminPermissions || hasCampaignAdminPermissions || hasCampaignStaffPermissions) {
            return getActivityByExpenditureAsync(params.expenditureId, perPage, page);
        }
    }

    return {
        total: 0,
        perPage,
        page,
        data: []
    };
}

export interface IGetActivityRecordsForEmails {
    campaignId: number;
    from: Date;
    to: Date;
}

export async function getActivityRecordsForEmailsAsync(params: IGetActivityRecordsForEmails): Promise<IShortActivityResult[]> {
    return await getActivityByCampaignByTimeAsync(params.campaignId, params.from, params.to);
}
