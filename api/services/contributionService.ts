import { getConnection } from 'typeorm';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType
} from '../models/entity/Contribution';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { isCampaignAdminAsync, isCampaignStaffAsync } from './permissionService';

export interface IAddContributionAttrs {
    address1: string;
    address2?: string;
    amount: number;
    campaignId: number;
    city: string;
    contributorType: ContributorType;
    currentUserId: number;
    email?: string;
    firstName?: string;
    governmentId: number;
    lastName?: string;
    matchAmount?: number;
    middleInitial?: string;
    name?: string;
    prefix?: string;
    state: string;
    status: ContributionStatus.DRAFT | ContributionStatus.SUBMITTED;
    suffix?: string;
    submitForMatch?: boolean;
    subType: ContributionSubType;
    title?: string;
    type: ContributionType;
    zip: string;
}

export async function addContributionAsync(contributionAttrs: IAddContributionAttrs): Promise<Contribution> {
    try {
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(contributionAttrs.currentUserId, contributionAttrs.campaignId)) ||
            (await isCampaignStaffAsync(contributionAttrs.currentUserId, contributionAttrs.campaignId));
        if (hasCampaignPermissions) {
            const defaultConn = getConnection('default');
            const contributionRepository = defaultConn.getRepository('Contribution');
            const governmentRepository = defaultConn.getRepository('Government');
            const campaignRepository = defaultConn.getRepository('Campaign');

            const contribution = new Contribution();

            const [campaign, government] = await Promise.all([
                campaignRepository.findOne(contributionAttrs.campaignId),
                governmentRepository.findOne(contributionAttrs.governmentId)
            ]);

            contribution.campaign = campaign as Campaign;
            contribution.government = government as Government;

            contribution.type = contributionAttrs.type;
            contribution.subType = contributionAttrs.subType;
            contribution.status = contributionAttrs.status;

            contribution.contrPrefix = contributionAttrs.prefix;
            contribution.contrFirst = contributionAttrs.firstName;
            contribution.contrMiddleInitial = contributionAttrs.middleInitial;
            contribution.contrLast = contributionAttrs.lastName;
            contribution.contrSuffix = contributionAttrs.suffix;
            contribution.contrTitle = contributionAttrs.title;
            contribution.email = contributionAttrs.email;
            contribution.address1 = contributionAttrs.address1;
            contribution.address2 = contributionAttrs.address2;
            contribution.city = contributionAttrs.city;
            contribution.state = contributionAttrs.state;
            contribution.zip = contributionAttrs.zip;
            contribution.contrName = contributionAttrs.name;
            contribution.contributorType = contributionAttrs.contributorType;

            contribution.amount = contributionAttrs.amount;
            contribution.matchAmount = contributionAttrs.matchAmount;
            contribution.submitForMatch = contributionAttrs.submitForMatch ? contributionAttrs.submitForMatch : false;
            if (await contribution.isValidAsync()) {
                await contributionRepository.save(contribution);
                return contribution;
            }
            throw new Error('Contribution is missing one or more required properties.');
        }
        throw new Error('User is not permitted to add contributions for this campaign.');
    } catch (e) {
        throw new Error(e.message);
    }
}
