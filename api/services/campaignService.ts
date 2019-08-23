import { getConnection } from 'typeorm';
import { Campaign, getCampaignSummariesByGovernmentIdAsync, ICampaignSummary } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import {
    addUserToCampaignAsync,
    isCampaignAdminAsync,
    isCampaignStaffAsync,
    isGovernmentAdminAsync
} from './permissionService';
import { UserRole } from '../models/entity/Permission';
import { ExpenditureSummaryByStatus, getExpenditureSummaryByStatusAsync } from '../models/entity/Expenditure';
import {
    Contribution,
    ContributionSummaryByStatus,
    getContributionsSummaryByStatusAsync
} from '../models/entity/Contribution';

export interface ICreateCampaign {
    name: string;
    governmentId: number;
    currentUserId: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    officeSought: string;
}

export async function createCampaignAsync(campaignAttrs: ICreateCampaign): Promise<Campaign> {
    try {

        if (await isGovernmentAdminAsync(campaignAttrs.currentUserId, campaignAttrs.governmentId)) {
            const campaignRepository = getConnection('default').getRepository('Campaign');
            const governmentRepository = getConnection('default').getRepository('Government');
            const campaign = new Campaign();
            campaign.name = campaignAttrs.name;
            campaign.officeSought = campaignAttrs.officeSought;
            const government = (await governmentRepository.findOne(campaignAttrs.governmentId)) as Government;
            campaign.government = government;
            if (await campaign.isValidAsync()) {
                const savedCampaign = await campaignRepository.save(campaign) as Campaign;
                if (campaignAttrs.email && campaignAttrs.firstName && campaignAttrs.lastName) {
                    await addUserToCampaignAsync({
                        email: campaignAttrs.email,
                        firstName: campaignAttrs.firstName,
                        lastName: campaignAttrs.lastName,
                        role: UserRole.CAMPAIGN_ADMIN,
                        campaignId: savedCampaign.id,
                        currentUserId: campaignAttrs.currentUserId
                    });
                }
            } else {
                throw new Error('Campaign is not valid');
            }
            return campaign;
        } else {
            throw new Error('User is not an admin for the provided government');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IGetCampaigns {
    currentUserId: number;
    governmentId: number;
}

export async function getCampaignsAsync({currentUserId, governmentId}: IGetCampaigns): Promise<ICampaignSummary[]> {
    try {
        if (await isGovernmentAdminAsync(currentUserId, governmentId)) {
            return getCampaignSummariesByGovernmentIdAsync(governmentId);
        } else {
            throw new Error('User is not an admin for the provided government');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface GetStatusSummaryAttrs {
    currentUserId: number;
    campaignId?: number;
    governmentId?: number;
}

export interface StatusSummary {
    contributions: ContributionSummaryByStatus[];
    expenditures: ExpenditureSummaryByStatus[];
}

export async function getStatusSummary(attrs: GetStatusSummaryAttrs): Promise<StatusSummary> {
    if (attrs.campaignId) {
        const repository = getConnection('default').getRepository('Campaign');
        const campaign = (await repository.findOneOrFail(attrs.campaignId, {
            relations: ['government']
        })) as Campaign;
        const hasGovPermissions = await isGovernmentAdminAsync(attrs.currentUserId, campaign.government.id);
        const hasCampaignPermissions = await isCampaignAdminAsync(attrs.currentUserId, attrs.campaignId) || await isCampaignStaffAsync(attrs.currentUserId, attrs.campaignId);
        if (hasGovPermissions || hasCampaignPermissions) {
            const contributions = await getContributionsSummaryByStatusAsync({
                campaignId: attrs.campaignId
            });
            const expenditures = await getExpenditureSummaryByStatusAsync({
                campaignId: attrs.campaignId
            });
            return {
                expenditures,
                contributions
            };
        } else {
            throw new Error('User does not have permissions for this campaign');
        }
    } else if (attrs.governmentId) {
        const hasGovPermissions = await isGovernmentAdminAsync(attrs.currentUserId, attrs.governmentId);
        const contributions = await getContributionsSummaryByStatusAsync({
            governmentId: attrs.governmentId
        });
        const expenditures = await getExpenditureSummaryByStatusAsync({
            governmentId: attrs.governmentId
        });
        return {
            expenditures,
            contributions
        };
    }
    throw new Error('Either governmentId or campaignId must be present');
}
