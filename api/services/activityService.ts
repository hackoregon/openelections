import {
    Activity,
    ActivityTypeEnum,
    getActivityByCampaignAsync,
    getActivityByGovernmentAsync,
    IActivityResult
} from '../models/entity/Activity';
import { getConnection } from 'typeorm';
import { Government } from '../models/entity/Government';
import { User } from '../models/entity/User';
import { Campaign } from '../models/entity/Campaign';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';

export interface ICreateActivityServiceParams {
    currentUser: User;
    government: Government;
    campaign?: Campaign;
    activityId: number;
    activityType: ActivityTypeEnum;
    notes: string;
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
    if (await activity.isValidAsync()) {
        activity = await repository.save(activity);
        return activity;
    }
    throw new Error('Invalid activity');
}

export interface IGetActivityRecordsForGovernmentOrCampaign {
    currentUserId: number;
    governmentId?: number; // get all actions by government, requires government admin
    campaignId?: number; // get all actions by government, requires government admin, campaign admin or staff
    perPage?: number;
    page?: number;
}

export async function getAllActivityRecordsforGovernmentOrCampaignAsync(params: IGetActivityRecordsForGovernmentOrCampaign): Promise<IActivityResult[]> {
    const hasGovAdminPermissions = await isGovernmentAdminAsync(params.currentUserId, params.governmentId);
    const hasCampaignAdminPermissions = hasGovAdminPermissions || await isCampaignAdminAsync(params.currentUserId, params.campaignId);
    const hasCampaignStaffPermissions = hasCampaignAdminPermissions || await isCampaignStaffAsync(params.currentUserId, params.campaignId);
    const perPage = params.perPage || 100;
    const page = params.page || 0;
    if ((params.governmentId && !params.campaignId) && hasGovAdminPermissions) {
        return getActivityByGovernmentAsync(params.governmentId, perPage, page);
    } else if (params.campaignId && hasCampaignStaffPermissions) {
        return getActivityByCampaignAsync(params.campaignId, perPage, page);
    }
    return [];
}
