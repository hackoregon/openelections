import {
    Expenditure,
    ExpenditureStatus,
    ExpenditureSubType,
    expenditureSummaryFields,
    ExpenditureType,
    getExpendituresByGovernmentIdAsync,
    IExpenditureSummary, IExpenditureSummaryResults,
    PayeeType,
    PaymentMethod,
    PurposeType
} from '../models/entity/Expenditure';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import { getConnection } from 'typeorm';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { Activity, ActivityTypeEnum } from '../models/entity/Activity';
import { createActivityRecordAsync } from './activityService';
import { User } from '../models/entity/User';

export interface IAddExpenditureAttrs {
    date: number;
    type: ExpenditureType;
    subType: ExpenditureSubType;
    payeeType: PayeeType;
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    amount: number;
    paymentMethod?: PaymentMethod;
    purpose?: PurposeType;
    checkNumber?: string;
    currentUserId: number;
    campaignId: number;
    governmentId: number;
    notes: string;
}

export async function addExpenditureAsync(expenditureAttrs: IAddExpenditureAttrs): Promise<Expenditure> {
    try {
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(expenditureAttrs.currentUserId, expenditureAttrs.campaignId)) ||
            (await isCampaignStaffAsync(expenditureAttrs.currentUserId, expenditureAttrs.campaignId));
        if (hasCampaignPermissions) {
            const defaultConn = getConnection('default');
            const expenditureRepository = defaultConn.getRepository('Expenditure');
            const governmentRepository = defaultConn.getRepository('Government');
            const campaignRepository = defaultConn.getRepository('Campaign');
            const userRepository = defaultConn.getRepository('User');

            const expenditure = new Expenditure();

            const [campaign, government] = await Promise.all([
                campaignRepository.findOne(expenditureAttrs.campaignId),
                governmentRepository.findOne(expenditureAttrs.governmentId)
            ]);

            expenditure.campaign = campaign as Campaign;
            expenditure.government = government as Government;

            expenditure.type = expenditureAttrs.type;
            expenditure.subType = expenditureAttrs.subType;
            expenditure.paymentMethod = expenditureAttrs.paymentMethod;
            expenditure.checkNumber = expenditureAttrs.checkNumber;
            expenditure.purpose = expenditureAttrs.purpose;

            expenditure.address1 = expenditureAttrs.address1;
            expenditure.address2 = expenditureAttrs.address2;
            expenditure.city = expenditureAttrs.city;
            expenditure.state = expenditureAttrs.state;
            expenditure.zip = expenditureAttrs.zip;
            expenditure.name = expenditureAttrs.name;
            expenditure.payeeType = expenditureAttrs.payeeType;

            expenditure.amount = expenditureAttrs.amount;
            expenditure.date = new Date(expenditureAttrs.date);
            expenditure.status = ExpenditureStatus.DRAFT;
            expenditure.notes = expenditureAttrs.notes;

            if (await expenditure.isValidAsync()) {
                const saved = await expenditureRepository.save(expenditure);
                const user = await userRepository.findOneOrFail(expenditureAttrs.currentUserId) as User;

                await createActivityRecordAsync({
                    currentUser: user,
                    notes: `${user.name()} added an expenditure (${saved.id}).`,
                    campaign: expenditure.campaign,
                    government: expenditure.government,
                    activityType: ActivityTypeEnum.EXPENDITURE,
                    activityId: saved.id
                });
                return saved;
            }
            throw new Error('Expenditure is missing one or more required properties.');
        }
        throw new Error('User is not permitted to add expenditures for this campaign.');
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IGetExpenditureAttrs {
    currentUserId?: number;
    governmentId?: number;
    campaignId?: number;
    perPage?: number;
    page?: number;
    status?: string;
    from?: string;
    to?: string;
    sort?: {
        field: 'campaignId' | 'status' | 'date';
        direction: 'ASC' | 'DESC';
    };
}

export async function getExpendituresAsync(expendituresAttrs: IGetExpenditureAttrs): Promise<IExpenditureSummaryResults> {
    try {
        const { governmentId, ...options } = expendituresAttrs;
        if (options.campaignId) {
            const hasCampaignPermissions =
                (await isCampaignAdminAsync(options.currentUserId, options.campaignId)) ||
                (await isCampaignStaffAsync(options.currentUserId, options.campaignId)) ||
                (await isGovernmentAdminAsync(options.currentUserId, governmentId));
            if (hasCampaignPermissions) {
                return getExpendituresByGovernmentIdAsync(governmentId, {
                    ...options,
                    page: options.page || 0,
                    perPage: options.perPage || 100
                });
            }
            throw new Error('User is not permitted to get expenditures for this campaign.');
        } else if (!(await isGovernmentAdminAsync(options.currentUserId, governmentId))) {
            throw new Error('Must be a government admin to see all expenditures');
        }
        return getExpendituresByGovernmentIdAsync(governmentId, {
            ...options,
            page: options.page || 0,
            perPage: options.perPage || 100
        });
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IUpdateExpenditureAttrs {
    id: number;
    currentUserId: number;
    type?: ExpenditureType;
    subType?: ExpenditureSubType;
    payeeType?: PayeeType;
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    amount?: number;
    description?: string;
    status?: ExpenditureStatus;
    paymentMethod?: PaymentMethod;
    purpose?: PurposeType;
    date?: number | Date;
    notes?: string;
}

export async function updateExpenditureAsync(expenditureAttrs: IUpdateExpenditureAttrs): Promise<Expenditure> {
    try {
        const defaultConn = getConnection('default');
        const expenditureRepository = defaultConn.getRepository('Expenditure');
        let expenditure = (await expenditureRepository.findOneOrFail(expenditureAttrs.id, {
            relations: ['campaign', 'government']
        })) as Expenditure;
        const userRepository = defaultConn.getRepository('User');
        const attrs = Object.assign({}, expenditureAttrs);
        if (attrs.date) {
            attrs.date = new Date(attrs.date);
        }
        delete attrs.currentUserId;
        delete attrs.id;
        const govAdmin = await isGovernmentAdminAsync(expenditureAttrs.currentUserId, expenditure.government.id);
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(expenditureAttrs.currentUserId, expenditure.campaign.id)) ||
            (await isCampaignStaffAsync(expenditureAttrs.currentUserId, expenditure.campaign.id)) ||
            (govAdmin);
        if (!govAdmin) {
            if (attrs.status === ExpenditureStatus.OUT_OF_COMPLIANCE || attrs.status === ExpenditureStatus.IN_COMPLIANCE ) {
                throw new Error('User does have permissions to change status on expenditure');
            }
        }
        if (hasCampaignPermissions) {
            const [_, user, changeNotes] = await Promise.all([
                expenditureRepository.update(expenditureAttrs.id, attrs),
                (userRepository.findOneOrFail({ id: expenditureAttrs.currentUserId }) as unknown) as User,
                Object.keys(attrs)
                    .map(k => `${k} changed from ${expenditure[k]} to ${attrs[k]}.`)
                    .join(' ')
            ]);

            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name()} updated expenditure ${expenditureAttrs.id} fields. ${changeNotes}`,
                campaign: expenditure.campaign,
                government: expenditure.government,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: expenditure.id
            });
            expenditure = await expenditureRepository.findOne(expenditure.id) as Expenditure;
            return expenditure;
        } else if (!(await isGovernmentAdminAsync(expenditureAttrs.currentUserId, expenditure.government.id))) {
            throw new Error('User is not permitted to update expenditures for this campaign.');
        }
        return expenditureRepository.save(expenditure);
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IExpenditureCommentAttrs {
    currentUserId: number;
    expenditureId: number;
    comment: string;
}

export async function createExpenditureCommentAsync(attrs: IExpenditureCommentAttrs): Promise<Activity> {
    try {
        const defaultConn = getConnection('default');
        const expenditureRepository = defaultConn.getRepository('Expenditure');
        const userRepository = defaultConn.getRepository('User');
        const expenditure = (await expenditureRepository.findOneOrFail(attrs.expenditureId, {
            relations: ['campaign', 'government']
        })) as Expenditure;
        const user = await userRepository.findOneOrFail(attrs.currentUserId) as User;

        const hasPermissions =
            (await isCampaignAdminAsync(user.id, expenditure.campaign.id)) ||
            (await isCampaignStaffAsync(user.id, expenditure.campaign.id)) ||
            (await isGovernmentAdminAsync(user.id, expenditure.government.id));
        if (hasPermissions) {
            return createActivityRecordAsync({
                currentUser: user,
                campaign: expenditure.campaign,
                government: expenditure.government,
                notes: `${user.name()}: ${attrs.comment}`,
                activityId: expenditure.id,
                activityType: ActivityTypeEnum.COMMENT_EXP
            });
        } else {
            throw new Error('User does not have permissions');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IGetExpenditureByIdAttrs {
    currentUserId: number;
    expenditureId: number;
}

export async function getExpenditureByIdAsync(
    expenditureAttrs: IGetExpenditureByIdAttrs
): Promise<IExpenditureSummary> {
    try {
        const { expenditureId, currentUserId } = expenditureAttrs;
        const expenditureRepository = getConnection('default').getRepository('Expenditure');
        let expenditure = (await expenditureRepository.findOneOrFail(expenditureId, {
            relations: ['campaign', 'government']
        })) as Expenditure;
        const hasCampaignPermissions =
            (await isCampaignAdminAsync(currentUserId, expenditure.campaign.id)) ||
            (await isCampaignStaffAsync(currentUserId, expenditure.campaign.id)) ||
            (await isGovernmentAdminAsync(currentUserId, expenditure.government.id));
        if (hasCampaignPermissions) {
            expenditure = (await expenditureRepository.findOne({
                select: expenditureSummaryFields,
                where: { id: expenditureId },
                relations: ['campaign', 'government']
            })) as Expenditure;
        } else {
            throw new Error('User does not have permissions');
        }
        return expenditure as IExpenditureSummary;
    } catch (e) {
        throw new Error(e.message);
    }
}
