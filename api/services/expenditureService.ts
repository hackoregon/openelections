import {
    ExpenditureType,
    ExpenditureSubType,
    PayeeType,
    ExpenditureStatus,
    Expenditure,
    getExpendituresByGovernmentIdAsync
} from '../models/entity/Expenditure';
import { isCampaignAdminAsync, isCampaignStaffAsync, isGovernmentAdminAsync } from './permissionService';
import { getConnection } from 'typeorm';
import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';

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
    description: string;
    status: ExpenditureStatus;
    currentUserId: number;
    campaignId: number;
    governmentId: number;
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

            const expenditure = new Expenditure();

            const [campaign, government] = await Promise.all([
                campaignRepository.findOne(expenditureAttrs.campaignId),
                governmentRepository.findOne(expenditureAttrs.governmentId)
            ]);

            expenditure.campaign = campaign as Campaign;
            expenditure.government = government as Government;

            expenditure.type = expenditureAttrs.type;
            expenditure.subType = expenditureAttrs.subType;
            expenditure.status = expenditureAttrs.status;
            expenditure.description = expenditureAttrs.description;

            expenditure.address1 = expenditureAttrs.address1;
            expenditure.address2 = expenditureAttrs.address2;
            expenditure.city = expenditureAttrs.city;
            expenditure.state = expenditureAttrs.state;
            expenditure.zip = expenditureAttrs.zip;
            expenditure.name = expenditureAttrs.name;
            expenditure.payeeType = expenditureAttrs.payeeType;

            expenditure.amount = expenditureAttrs.amount;
            expenditure.date = new Date(expenditureAttrs.date);
            if (await expenditure.isValidAsync()) {
                return await expenditureRepository.save(expenditure);
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
}

export async function getExpendituresAsync(expendituresAttrs: IGetExpenditureAttrs) {
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
}

export async function updateExpenditureAsync(expenditureAttrs: IUpdateExpenditureAttrs): Promise<Expenditure> {
    try {
        const defaultConn = getConnection('default');
        const expenditureRepository = defaultConn.getRepository('Expenditure');
        const expenditure = (await expenditureRepository.findOneOrFail(expenditureAttrs.id, {
            relations: ['campaign', 'government']
        })) as Expenditure;
        const attrs = Object.assign({}, expenditureAttrs);
        delete attrs.currentUserId;
        delete attrs.id;
        if (expenditure.status === ExpenditureStatus.DRAFT) {
            const hasCampaignPermissions =
                (await isCampaignAdminAsync(expenditureAttrs.currentUserId, expenditure.campaign.id)) ||
                (await isCampaignStaffAsync(expenditureAttrs.currentUserId, expenditure.campaign.id)) ||
                (await isGovernmentAdminAsync(expenditureAttrs.currentUserId, expenditure.government.id));
            if (hasCampaignPermissions) {
                return expenditureRepository.save(expenditure);
            } else {
                throw new Error('User is not permitted to update expenditures for this campaign.');
            }
        } else if (!(await isGovernmentAdminAsync(expenditureAttrs.currentUserId, expenditure.government.id))) {
            throw new Error('User is not permitted to update expenditures in a non-draft state for this campaign.');
        }
        return expenditureRepository.save(expenditure);
    } catch (e) {
        throw new Error(e.message);
    }
}
