import {
    ExpenditureType,
    ExpenditureSubType,
    PayeeType,
    ExpenditureStatus,
    Expenditure
} from '../models/entity/Expenditure';
import { isCampaignAdminAsync, isCampaignStaffAsync } from './permissionService';
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
            const expenditureRepository = defaultConn.getRepository('expenditure');
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
            throw new Error('expenditure is missing one or more required properties.');
        }
        throw new Error('User is not permitted to add expenditures for this campaign.');
    } catch (e) {
        throw new Error(e.message);
    }
}

export interface IGetExpenditureOptions {
    currentUserId?: number;
    campaignId?: number;
    perPage?: number;
    page?: number;
    status?: string;
    from?: string;
    to?: string;
}
