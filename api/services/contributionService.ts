import { getConnection } from 'typeorm';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    IContributionSummary,
    getContributionsByGovernmentIdAsync
} from '../models/entity/Contribution';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';

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
            contribution.firstName = contributionAttrs.firstName;
            contribution.middleInitial = contributionAttrs.middleInitial;
            contribution.lastName = contributionAttrs.lastName;
            contribution.suffix = contributionAttrs.suffix;
            contribution.title = contributionAttrs.title;
            contribution.email = contributionAttrs.email;
            contribution.address1 = contributionAttrs.address1;
            contribution.address2 = contributionAttrs.address2;
            contribution.city = contributionAttrs.city;
            contribution.state = contributionAttrs.state;
            contribution.zip = contributionAttrs.zip;
            contribution.name = contributionAttrs.name;
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

export interface IGetContributionOptions {
    currentUserId?: number;
    campaignId?: number;
    perPage?: number;
    page?: number;
    status?: string;
    from?: string;
    to?: string;
}

export interface IGetContributionAttrs extends IGetContributionOptions {
    governmentId: number;
}

export async function getContributionsAsync(contributionAttrs: IGetContributionAttrs): Promise<IContributionSummary[]> {
    try {
        const { governmentId, ...options } = contributionAttrs;
        if (options.campaignId) {
            const hasCampaignPermissions =
                (await isCampaignAdminAsync(options.currentUserId, options.campaignId)) ||
                (await isCampaignStaffAsync(options.currentUserId, options.campaignId)) ||
                (await isGovernmentAdminAsync(options.currentUserId, governmentId));
            if (hasCampaignPermissions) {
                return getContributionsByGovernmentIdAsync(governmentId, {
                    ...options,
                    page: options.page || 0,
                    perPage: options.perPage || 100
                });
            }
            throw new Error('User is not permitted to get contributions for this campaign.');
        } else if (!(await isGovernmentAdminAsync(options.currentUserId, governmentId))) {
            throw new Error('Must be a government admin to see all contributions');
        }
        return getContributionsByGovernmentIdAsync(governmentId, {
            ...options,
            page: options.page || 0,
            perPage: options.perPage || 100
        });
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IUpdateContributionAttrs {
    currentUserId: number;
    id: number;
    address1?: string;
    address2?: string;
    amount?: number;
    city?: string;
    contributorType?: ContributorType;
    email?: string;
    firstName?: string;
    lastName?: string;
    matchAmount?: number;
    middleInitial?: string;
    name?: string;
    prefix?: string;
    state?: string;
    status?: ContributionStatus;
    suffix?: string;
    submitForMatch?: boolean;
    subType?: ContributionSubType;
    title?: string;
    type?: ContributionType;
    zip?: string;
}

export async function updateContributionAsync(contributionAttrs: IUpdateContributionAttrs): Promise<void> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');
        const contribution = await contributionRepository.findOneOrFail(contributionAttrs.id, {relations: ['campaign', 'government']}) as Contribution;
        const attrs = Object.assign({}, contributionAttrs);
        delete attrs.currentUserId;
        delete attrs.id;
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(contributionAttrs.currentUserId, contribution.government.id));
        if (hasCampaignPermissions) {
            await contributionRepository.update(contributionAttrs.id, attrs);
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}
