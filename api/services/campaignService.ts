import { getConnection } from 'typeorm';
import { Campaign, getCampaignSummariesByGovernmentIdAsync, ICampaignSummary } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { addUserToCampaignAsync, isGovernmentAdminAsync } from './permissionService';
import { UserRole } from '../models/entity/Permission';

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
