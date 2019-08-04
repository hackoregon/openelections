import { getConnection, UpdateResult } from 'typeorm';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    contributionSummaryFields,
    ContributionType,
    ContributorType,
    getContributionsByGovernmentIdAsync,
    IContributionSummary
} from '../models/entity/Contribution';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import { User } from '../models/entity/User';
import { Activity, ActivityTypeEnum } from '../models/entity/Activity';
import { createActivityRecordAsync } from './activityService';

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
    date: number;
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
            const userRepository = defaultConn.getRepository('User');

            const contribution = new Contribution();

            const [campaign, government, user] = await Promise.all([
                campaignRepository.findOne(contributionAttrs.campaignId),
                governmentRepository.findOne(contributionAttrs.governmentId),
                (userRepository.findOneOrFail(contributionAttrs.currentUserId) as unknown) as User
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
            contribution.date = new Date(contributionAttrs.date);
            if (await contribution.isValidAsync()) {
                const saved = await contributionRepository.save(contribution);
                await createActivityRecordAsync({
                    currentUser: user,
                    notes: `${user.name()} added a contribution (${saved.id}).`,
                    campaign: contribution.campaign,
                    government: contribution.government,
                    activityType: ActivityTypeEnum.CONTRIBUTION,
                    activityId: saved.id
                });
                return saved;
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
        const userRepository = defaultConn.getRepository('User');
        const contribution = (await contributionRepository.findOneOrFail(contributionAttrs.id, {
            relations: ['campaign', 'government']
        })) as Contribution;
        const attrs = Object.assign({}, contributionAttrs);
        delete attrs.currentUserId;
        delete attrs.id;
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(contributionAttrs.currentUserId, contribution.government.id));
        if (hasCampaignPermissions) {
            const [_, user, changeNotes] = await Promise.all([
                contributionRepository.update(contributionAttrs.id, attrs),
                (userRepository.findOneOrFail({ id: contributionAttrs.currentUserId }) as unknown) as User,
                Object.keys(attrs)
                    .map(k => `${k} changed from ${contribution[k]} to ${attrs[k]}.`)
                    .join(' ')
            ]);
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name()} updated contribution ${contributionAttrs.id} fields. ${changeNotes}`,
                campaign: contribution.campaign,
                government: contribution.government,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: contribution.id
            });
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IGetContributionByIdAttrs {
    currentUserId: number;
    contributionId: number;
}

export async function getContributionByIdAsync(
    contributionAttrs: IGetContributionByIdAttrs
): Promise<IContributionSummary> {
    try {
        const { contributionId, currentUserId } = contributionAttrs;
        const contributionRepository = getConnection('default').getRepository('Contribution');
        let contribution = (await contributionRepository.findOneOrFail(contributionId, {
            relations: ['campaign', 'government']
        })) as Contribution;
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(currentUserId, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(currentUserId, contribution.government.id));
        if (hasCampaignPermissions) {
            contribution = (await contributionRepository.findOne({
                select: contributionSummaryFields,
                where: { id: contributionId },
                relations: ['campaign', 'government']
            })) as Contribution;
        } else {
            throw new Error('User does not have permissions');
        }
        return contribution as IContributionSummary;
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IArchiveContributionByIdOptions {
    currentUserId: number;
    contributionId: number;
}

export async function archiveContributionAsync(contrAttrs: IArchiveContributionByIdOptions) {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');
        const userRepository = defaultConn.getRepository('User');
        const [contribution, user] = await Promise.all([
            (contributionRepository.findOneOrFail(contrAttrs.contributionId, {
                relations: ['campaign', 'government']
            }) as unknown) as Contribution,
            (userRepository.findOneOrFail(contrAttrs.currentUserId) as unknown) as User
        ]);
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(contrAttrs.currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(contrAttrs.currentUserId, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(contrAttrs.currentUserId, contribution.government.id));
        if (hasCampaignPermissions && contribution.status === ContributionStatus.DRAFT) {
            contribution.status = ContributionStatus.ARCHIVED;
            await contributionRepository.save(contribution);
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.email} archived contribution ${contribution.id}.`,
                campaign: contribution.campaign,
                government: contribution.government,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: contribution.id
            });
            return getContributionByIdAsync(contrAttrs);
        } else {
            throw new Error('Contribution must have status of Draft to be Archived');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export interface IArchiveContributionByIdOptions {
    currentUserId: number;
    contributionId: number;
}

export interface IContributionCommentAttrs {
    currentUserId: number;
    contributionId: number;
    comment: string;
}

export async function createContributionCommentAsync(attrs: IContributionCommentAttrs): Promise<Activity> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');
        const userRepository = defaultConn.getRepository('User');
        const contribution = (await contributionRepository.findOneOrFail(attrs.contributionId, {
            relations: ['campaign', 'government']
        })) as Contribution;

        const user = await userRepository.findOneOrFail(attrs.currentUserId) as User;
        
        const hasPermissions =
            (await isCampaignAdminAsync(user.id, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(user.id, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(user.id, contribution.government.id));
        if (hasPermissions) {
            return createActivityRecordAsync({
                currentUser: user,
                campaign: contribution.campaign,
                government: contribution.government,
                notes: `${user.name()}: ${attrs.comment}`,
                activityId: contribution.id,
                activityType: ActivityTypeEnum.COMMENT_CONTR
            });
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}
