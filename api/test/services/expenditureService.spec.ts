import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import { IAddExpenditureAttrs, addExpenditureAsync } from '../../services/expenditureService';
import { PayeeType, ExpenditureSubType, ExpenditureType, ExpenditureStatus } from '../../models/entity/Expenditure';

let campaignAdmin;
let campaignStaff;
let govAdmin;
let campaign1;
let campaign2;
let government;

let expenditureRepository: any;

describe('contributionService', () => {
    before(() => {
        expenditureRepository = getConnection('default').getRepository('Expenditure');
    });

    beforeEach(async () => {
        [campaignAdmin, campaignStaff, govAdmin, government, campaign1, campaign2] = await Promise.all([
            newActiveUserAsync(),
            newActiveUserAsync(),
            newActiveUserAsync(),
            newGovernmentAsync(),
            newCampaignAsync(),
            newCampaignAsync()
        ]);

        await Promise.all([
            addPermissionAsync({
                userId: campaignAdmin.id,
                governmentId: government.id,
                campaignId: campaign1.id,
                role: UserRole.CAMPAIGN_ADMIN
            }),
            addPermissionAsync({
                userId: campaignStaff.id,
                governmentId: government.id,
                campaignId: campaign2.id,
                role: UserRole.CAMPAIGN_STAFF
            }),
            addPermissionAsync({
                userId: govAdmin.id,
                governmentId: government.id,
                role: UserRole.GOVERNMENT_ADMIN
            })
        ]);
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('Adds a valid expenditure for a campaign', async () => {
        expect(await expenditureRepository.count()).equal(0);

        const addExpenditureAttrs: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign2.id,
            city: 'Portland',
            currentUserId: campaignStaff.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            description: 'Test description',
            payeeType: PayeeType.INDIVIDUAL,
            status: ExpenditureStatus.DRAFT,
            date: Date.now()
        };

        await addExpenditureAsync(addExpenditureAttrs);
        expect(await expenditureRepository.count()).equal(1);
    });
});
