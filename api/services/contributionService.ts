import { getConnection } from 'typeorm';
import {
    Contribution,
    contributionGovSummaryFields,
    ContributionStatus,
    ContributionSubType,
    contributionSummaryFields,
    ContributionType,
    ContributorType,
    convertToCsv,
    getContributionsGeoJsonAsync,
    IContributionsGeoJson,
    convertToXml,
    getContributionsByGovernmentIdAsync,
    IContributionGovSummary,
    IContributionSummary,
    IContributionSummaryResults,
    InKindDescriptionType,
    MatchStrength,
    OaeType,
    PaymentMethod,
    PhoneType
} from '../models/entity/Contribution';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import { User } from '../models/entity/User';
import { Activity, ActivityTypeEnum } from '../models/entity/Activity';
import { createActivityRecordAsync, saveFileAttachmentAsync } from './activityService';
import { PersonMatchType, retrieveResultAsync } from './dataScienceService';
import * as crypto from 'crypto';
import { geocodeAddressAsync } from './gisService';
import { addDataScienceJob, renderError } from '../jobs/helpers/addJobs';
import { UploadedFile } from 'express-fileupload';

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
    phone?: string;
    middleInitial?: string;
    name?: string;
    prefix?: string;
    state: string;
    suffix?: string;
    submitForMatch?: boolean;
    subType: ContributionSubType;
    inKindType?: InKindDescriptionType;
    title?: string;
    oaeType?: OaeType;
    type: ContributionType;
    date: number;
    paymentMethod: PaymentMethod;
    zip: string;
    occupationLetterDate?: number;
    occupation?: string;
    employerName?: string;
    employerCity?: string;
    employerState?: string;
    employerCountry?: string;
    phoneType?: PhoneType;
    checkNumber?: string;
    notes?: string;
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

            contribution.contrPrefix = contributionAttrs.prefix;
            contribution.firstName = contributionAttrs.firstName;
            contribution.middleInitial = contributionAttrs.middleInitial;
            contribution.lastName = contributionAttrs.lastName;
            contribution.phone = contributionAttrs.phone;
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
            contribution.inKindType = contributionAttrs.inKindType;
            contribution.oaeType = contributionAttrs.oaeType;
            contribution.paymentMethod = contributionAttrs.paymentMethod;
            contribution.occupationLetterDate =
                contributionAttrs.occupationLetterDate && new Date(contributionAttrs.occupationLetterDate);
            contribution.occupation = contributionAttrs.occupation;
            contribution.employerName = contributionAttrs.employerName;
            contribution.employerCity = contributionAttrs.employerCity;
            contribution.employerState = contributionAttrs.employerState;
            contribution.employerCountry = contributionAttrs.employerCountry;
            contribution.phoneType = contributionAttrs.phoneType;
            contribution.checkNumber = contributionAttrs.checkNumber;
            contribution.status = ContributionStatus.DRAFT;
            contribution.amount = contributionAttrs.amount;
            contribution.date = new Date(contributionAttrs.date);
            contribution.notes = contributionAttrs.notes;
            if (await contribution.isValidAsync()) {
                const saved = await contributionRepository.save(contribution);
                await createActivityRecordAsync({
                    currentUser: (user as User),
                    notes: `${(user as User).name()} added a contribution (${saved.id}).`,
                    campaign: contribution.campaign,
                    government: contribution.government,
                    activityType: ActivityTypeEnum.CONTRIBUTION,
                    activityId: saved.id
                });
                if (process.env.NODE_ENV !== 'test') {
                    try {
                        await addDataScienceJob({ id: saved.id });
                    } catch (error) {
                        console.log('Error performing addDataScienceJob', renderError(error));
                    }
                } else {
                    await getGISCoordinates(saved.id);
                    await retrieveAndSaveMatchResultAsync(saved.id);
                }

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
    matchId?: string;
    perPage?: number;
    page?: number;
    status?: string;
    from?: string;
    to?: string;
    sort?: {
        field: 'campaignId' | 'status' | 'date' | 'id';
        direction: 'ASC' | 'DESC';
    };
    format?: 'json' | 'csv' | 'geoJson' | 'xml';
}

export interface IGetContributionAttrs extends IGetContributionOptions {
    governmentId: number;
    filerId?: string | number;
}

export async function getContributionsAsync(
    contributionAttrs: IGetContributionAttrs
): Promise<IContributionSummaryResults> {
    try {
        const { governmentId, ...options } = contributionAttrs;
        const govAdmin = await isGovernmentAdminAsync(options.currentUserId, governmentId);
        if (options.matchId && !govAdmin) {
            throw new Error('User is not permitted to get contributions by matchId.');
        } else if (options.campaignId) {
            const hasCampaignPermissions =
                (await isCampaignAdminAsync(options.currentUserId, options.campaignId)) ||
                (await isCampaignStaffAsync(options.currentUserId, options.campaignId)) ||
                govAdmin;
            if (!hasCampaignPermissions) {
                throw new Error('User is not permitted to get contributions for this campaign.');
            }
        } else if (!govAdmin) {
            throw new Error('Must be a government admin to see all contributions');
        }
        let contributions: IContributionSummaryResults;
        if (contributionAttrs.format === 'xml') {
            // This exists here to override the default perPage of 100
            contributions = await getContributionsByGovernmentIdAsync(governmentId, {
                ...options,
                page: options.page || 0
            });
            contributions.xml = convertToXml(contributions, contributionAttrs.filerId);
            return contributions;
        }
        contributions = await getContributionsByGovernmentIdAsync(governmentId, {
            ...options,
            page: options.page || 0,
            perPage: options.perPage || 100
        });

        if (contributionAttrs.format === 'csv') {
            contributions.csv = convertToCsv(contributions);
        }

        return contributions;
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
    compliant?: boolean;
    oaeType?: OaeType;
    inKindType?: InKindDescriptionType;
    paymentMethod?: PaymentMethod;
    date?: number | Date;
    occupationLetterDate?: number | Date;
    notes?: string;
    occupation?: string;
    employerName?: string;
    employerCity?: string;
    employerState?: string;
    employerCountry?: string;
}

export async function updateContributionAsync(contributionAttrs: IUpdateContributionAttrs): Promise<Contribution> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');
        const userRepository = defaultConn.getRepository('User');
        let contribution = (await contributionRepository.findOneOrFail(contributionAttrs.id, {
            relations: ['campaign', 'government']
        })) as Contribution;
        const attrs = Object.assign({}, contributionAttrs);
        if (attrs.date) {
            attrs.date = new Date(attrs.date);
        }

        if (attrs.occupationLetterDate) {
            attrs.occupationLetterDate = new Date(attrs.occupationLetterDate);
        }

        delete attrs.currentUserId;
        delete attrs.id;
        const isGovAdmin = await isGovernmentAdminAsync(contributionAttrs.currentUserId, contribution.government.id);
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(contributionAttrs.currentUserId, contribution.campaign.id)) ||
            isGovAdmin;

        if (contribution.status === ContributionStatus.PROCESSED) {
            if (!isGovAdmin) {
                throw new Error(
                    'User does not have permissions to change attributes on a contribution with submitted status'
                );
            }
        }

        if (Object.keys(contributionAttrs).includes('compliant')) {
            if (!isGovAdmin) {
                throw new Error('User does not have permissions to change compliant status');
            }
        }

        if (Object.keys(contributionAttrs).includes('status')) {
            if (!isGovAdmin && contributionAttrs.status === ContributionStatus.PROCESSED) {
                throw new Error('User does not have permissions to change status to processed');
            }
        }

        if (Object.keys(contributionAttrs).includes('matchAmount')) {
            if (!isGovAdmin) {
                throw new Error('User does not have permissions to change matchAmount');
            }
        }

        if (hasCampaignPermissions) {
            const [_, user, changeNotes] = await Promise.all([
                contributionRepository.update(contributionAttrs.id, attrs),
                (userRepository.findOneOrFail({ id: contributionAttrs.currentUserId }) as unknown) as User,
                Object.keys(attrs)
                    .filter(key => attrs[key] && attrs[key] !== '')
                    .filter(key => contribution[key] && contribution[key] !== '')
                    .filter(key => contribution[key] !== attrs[key])
                    .map(k => `${k} changed from ${contribution[k]} to ${attrs[k]}.`)
                    .join(' ')
            ]);
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name()} updated contribution ${contributionAttrs.id} fields. ${changeNotes}`,
                campaign: contribution.campaign,
                government: contribution.government,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: contribution.id,
                notify: isGovAdmin
            });
            contribution = (await contributionRepository.findOneOrFail(contributionAttrs.id, {
                relations: ['campaign', 'government']
            })) as Contribution;
            return contribution;
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
): Promise<IContributionSummary | IContributionGovSummary> {
    try {
        const { contributionId, currentUserId } = contributionAttrs;
        const contributionRepository = getConnection('default').getRepository('Contribution');
        let contribution = (await contributionRepository.findOneOrFail(contributionId, {
            relations: ['campaign', 'government']
        })) as Contribution;
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(currentUserId, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(currentUserId, contribution.campaign.id));
        const hasGovPermissions = await isGovernmentAdminAsync(currentUserId, contribution.government.id);
        if (hasCampaignPermissions || hasGovPermissions) {
            contribution = (await contributionRepository.findOne({
                select: hasGovPermissions ? contributionGovSummaryFields : contributionSummaryFields,
                where: { id: contributionId },
                relations: ['campaign', 'government']
            })) as Contribution;
        } else {
            throw new Error('User does not have permissions');
        }
        return contribution.toJSON(hasGovPermissions);
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
                notes: `${user.name()} archived contribution ${contribution.id}.`,
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
    attachmentPath?: UploadedFile;
}

export async function createContributionCommentAsync(attrs: IContributionCommentAttrs): Promise<Activity> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');
        const userRepository = defaultConn.getRepository('User');
        const activityRepository = defaultConn.getRepository('Activity');
        const contribution = (await contributionRepository.findOneOrFail(attrs.contributionId, {
            relations: ['campaign', 'government']
        })) as Contribution;

        const user = (await userRepository.findOneOrFail(attrs.currentUserId)) as User;

        const hasPermissions =
            (await isCampaignAdminAsync(user.id, contribution.campaign.id)) ||
            (await isCampaignStaffAsync(user.id, contribution.campaign.id)) ||
            (await isGovernmentAdminAsync(user.id, contribution.government.id));
        if (hasPermissions) {
            const activity = await createActivityRecordAsync({
                currentUser: user,
                campaign: contribution.campaign,
                government: contribution.government,
                notes: `${user.name()}: ${attrs.comment}`,
                activityId: contribution.id,
                activityType: ActivityTypeEnum.COMMENT_CONTR,
                notify: true
            });
            if (attrs.attachmentPath) {
                const attachmentPath = await saveFileAttachmentAsync(
                    activity.id,
                    'contributions',
                    attrs.attachmentPath.name,
                    attrs.attachmentPath.tempFilePath
                );
                await activityRepository.update(activity.id, { attachmentPath });
                return activity;
            }
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export async function retrieveAndSaveMatchResultAsync(contributionId: number): Promise<void> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');

        const contribution = (await contributionRepository.findOneOrFail(contributionId, {
            relations: ['campaign', 'government']
        })) as Contribution;

        if (contribution.validateContributorAddress()) {
            contribution.matchResult = await retrieveResultAsync({
                first_name: contribution.firstName,
                last_name: contribution.lastName,
                addr1: contribution.address1,
                addr2: contribution.address2,
                city: contribution.city,
                state: contribution.state,
                zip_code: contribution.zip,
                addressPoint: contribution.addressPoint
            });

            if (contribution.matchResult.exact.length > 0) {
                contribution.matchId = contribution.matchResult.exact[0].id;
                contribution.matchStrength = MatchStrength.EXACT;
            } else if (contribution.matchResult.strong.length > 0) {
                // tslint:disable-next-line:no-null-keyword
                contribution.matchId = null;
                contribution.matchStrength = MatchStrength.STRONG;
            } else if (contribution.matchResult.weak.length > 0) {
                contribution.matchStrength = MatchStrength.WEAK;
                // tslint:disable-next-line:no-null-keyword
                contribution.matchId = null;
            } else {
                contribution.matchId = crypto.randomBytes(16).toString('hex');
                contribution.matchStrength = MatchStrength.NONE;
            }
            await contributionRepository.save(contribution);
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface UpdateMatchResultAttrs {
    currentUserId: number;
    matchStrength: MatchStrength;
    matchId: string;
    contributionId: number;
}

export async function updateMatchResultAsync(attrs: UpdateMatchResultAttrs): Promise<boolean> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');

        const contribution = (await contributionRepository.findOneOrFail(attrs.contributionId, {
            relations: ['government', 'campaign']
        })) as Contribution;

        if (contribution.matchStrength === MatchStrength.EXACT) {
            throw new Error('Contribution has an exact match, cannot update');
        }

        const hasPermissions = await isGovernmentAdminAsync(attrs.currentUserId, contribution.government.id);

        if (hasPermissions) {
            contribution.matchId = attrs.matchId;
            contribution.matchStrength = attrs.matchStrength;
            await contributionRepository.save(contribution);
            return true;
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface GetMatchResultAttrs {
    currentUserId: number;
    contributionId: number;
}

export interface MatchResults {
    matchId: string;
    matchStrength: MatchStrength;
    results: {
        exact: PersonMatchType[];
        strong: PersonMatchType[];
        weak: PersonMatchType[];
        none: string;
    };
    inPortland: boolean;
}

export async function getMatchResultAsync(attrs: GetMatchResultAttrs): Promise<MatchResults> {
    try {
        const defaultConn = getConnection('default');
        const contributionRepository = defaultConn.getRepository('Contribution');

        const contribution = (await contributionRepository.findOneOrFail(attrs.contributionId, {
            relations: ['government']
        })) as Contribution;

        const hasPermissions = await isGovernmentAdminAsync(attrs.currentUserId, contribution.government.id);
        console.log('this far?', contribution, hasPermissions);
        if (hasPermissions) {
            if (contribution.matchId && contribution.matchResult) {
                const matchResults: MatchResults = {
                    matchId: contribution.matchId,
                    matchStrength: contribution.matchStrength,
                    results: {
                        exact: contribution.matchResult.exact,
                        strong: contribution.matchResult.strong,
                        weak: contribution.matchResult.weak,
                        none: crypto.randomBytes(16).toString('hex')
                    },
                    inPortland: contribution.matchResult.donor_info.eligible_address
                };
                return matchResults;
            } else {
                throw new Error('No match result for contribution');
            }
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        console.log('what up tho?', e);
        throw new Error(e.message);
    }
}

export async function getGISCoordinates(contributionId: number): Promise<boolean> {
    const defaultConn = getConnection('default');
    const contributionRepository = defaultConn.getRepository('Contribution');

    const contribution = (await contributionRepository.findOneOrFail(contributionId)) as Contribution;
    if (contribution.address1 && contribution.state && contribution.city && contribution.zip) {
        const result = await geocodeAddressAsync({
            address1: contribution.address1,
            city: contribution.city,
            state: contribution.state,
            zip: contribution.zip
        });
        if (result) {
            await contributionRepository.update(contributionId, {
                addressPoint: {
                    type: 'Point',
                    coordinates: result
                }
            });
        }
        return true;
    }
    return false;
}

export interface IGetContributionGeoJsonOptions {
    from?: string;
    to?: string;
}

export async function getContributionsGeoAsync(attrs: IGetContributionGeoJsonOptions): Promise<IContributionsGeoJson> {
    return getContributionsGeoJsonAsync(attrs);
}
