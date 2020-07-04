import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import { newActiveUserAsync, newCampaignAsync, newExpenditureAsync, newGovernmentAsync, truncateAll } from '../factories';
import {
    addExpenditureAsync,
    createExpenditureCommentAsync,
    getExpenditureByIdAsync,
    getExpendituresAsync,
    IAddExpenditureAttrs,
    IGetExpenditureAttrs,
    updateExpenditureAsync
} from '../../services/expenditureService';
import {
    ExpenditureStatus,
    ExpenditureSubType,
    ExpenditureType,
    PayeeType,
    PaymentMethod, PurposeType
} from '../../models/entity/Expenditure';
import { getActivityByExpenditureAsync } from '../../models/entity/Activity';

let campaignAdmin;
let campaignStaff;
let govAdmin;
let campaign1;
let campaign2;
let government;

let expenditureRepository: any;

describe('expenditureService', () => {
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

    it('Gets expenditures for a campaign as staff', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await Promise.all([addExpenditureAsync(addExpenditureAttrs), addExpenditureAsync(addExpenditureAttrs)]);

        const getExpendituresAttrs: IGetExpenditureAttrs = {
            campaignId: campaign2.id,
            currentUserId: campaignStaff.id,
            governmentId: government.id
        };
        await getExpendituresAsync(getExpendituresAttrs).then(expenditures => {
            expect(expenditures.data.length).equal(2);
        });
    });

    it('Gets expenditures for a campaign as admin', async () => {
        const addExpenditureAttrs: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await Promise.all([addExpenditureAsync(addExpenditureAttrs), addExpenditureAsync(addExpenditureAttrs)]);

        const getExpendituresAttrs: IGetExpenditureAttrs = {
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id
        };
        await getExpendituresAsync(getExpendituresAttrs).then(expenditures => {
            expect(expenditures.data.length).equal(2);
        });
    });

    it('Gets all expenditures as gov admin', async () => {
        const addExpenditureAttrs1: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        const addExpenditureAttrs2: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await Promise.all([
            addExpenditureAsync(addExpenditureAttrs1),
            addExpenditureAsync(addExpenditureAttrs1),
            addExpenditureAsync(addExpenditureAttrs2)
        ]);

        const getExpendituresAttrs: IGetExpenditureAttrs = {
            currentUserId: govAdmin.id,
            governmentId: government.id
        };
        await getExpendituresAsync(getExpendituresAttrs).then(expenditures => {s
            expect(expenditures.data.length).equal(3);
        });
    });

    it('Throws an error requesting expenditures as campaign admin or staff', async () => {
        try {
            const getExpendituresAttrs: IGetExpenditureAttrs = {
                currentUserId: campaignAdmin.id,
                governmentId: government.id
            };
            await getExpendituresAsync(getExpendituresAttrs);
        } catch (e) {
            expect(e.message).equal('Must be a government admin to see all expenditures');
        }

        try {
            const getExpendituresAttrs: IGetExpenditureAttrs = {
                currentUserId: campaignStaff.id,
                governmentId: government.id
            };
            await getExpendituresAsync(getExpendituresAttrs);
        } catch (e) {
            expect(e.message).equal('Must be a government admin to see all expenditures');
        }
    });

    it('Does not get expenditures for a campaign if the user lacks perms', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await Promise.all([addExpenditureAsync(addExpenditureAttrs), addExpenditureAsync(addExpenditureAttrs)]);

        try {
            const getExpendituresAttrs: IGetExpenditureAttrs = {
                campaignId: campaign1.id,
                currentUserId: campaignStaff.id,
                governmentId: government.id
            };
            await getExpendituresAsync(getExpendituresAttrs);
        } catch (e) {
            expect(e.message).equal('User is not permitted to get expenditures for this campaign.');
        }

        try {
            const getExpendituresAttrs: IGetExpenditureAttrs = {
                campaignId: campaign2.id,
                currentUserId: campaignAdmin.id,
                governmentId: government.id
            };
            await getExpendituresAsync(getExpendituresAttrs);
        } catch (e) {
            expect(e.message).equal('User is not permitted to get expenditures for this campaign.');
        }
    });

    it('Adds a valid expenditure for a campaign as staff', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await addExpenditureAsync(addExpenditureAttrs);
        expect(await expenditureRepository.count()).equal(1);
    });

    it('Adds a valid expenditure for a campaign as admin', async () => {
        expect(await expenditureRepository.count()).equal(0);

        const addExpenditureAttrs: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        await addExpenditureAsync(addExpenditureAttrs);
        expect(await expenditureRepository.count()).equal(1);
    });

    it('Does not add an invalid expenditure for a campaign', async () => {
        const addExpenditureAttrs: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: undefined,
            campaignId: campaign2.id,
            city: 'Portland',
            currentUserId: campaignStaff.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: undefined
        };

        try {
            await addExpenditureAsync(addExpenditureAttrs);
        } catch (e) {
            expect(e.message).equal('Expenditure is missing one or more required properties.');
        }
    });

    it('Does not add a expenditure for a campaign if the user lacks perms', async () => {
        const addExpenditureAttrs: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: undefined,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignStaff.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: undefined
        };

        try {
            await addExpenditureAsync(addExpenditureAttrs);
        } catch (e) {
            expect(e.message).equal('User is not permitted to add expenditures for this campaign.');
        }
    });

    it('Updates an expenditure for a campaign as staff or admin, or as gov admin', async () => {
        const addExpenditureAttrs1: IAddExpenditureAttrs = {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        const addExpenditureAttrs2: IAddExpenditureAttrs = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign1.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            state: 'OR',
            zip: '97214',
            type: ExpenditureType.EXPENDITURE,
            subType: ExpenditureSubType.ACCOUNTS_PAYABLE,
            name: 'Test expense',
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        const [expenditure1, expenditure2] = await Promise.all([
            addExpenditureAsync(addExpenditureAttrs1),
            addExpenditureAsync(addExpenditureAttrs2)
        ]);

        const updateExpenditure1 = {
            id: expenditure1.id,
            amount: 500,
            currentUserId: campaignStaff.id
        };

        const updateExpenditure2 = {
            id: expenditure2.id,
            name: 'foo',
            currentUserId: campaignAdmin.id
        };

        const updateExpenditure1Gov = {
            id: updateExpenditure1.id,
            name: 'bar',
            currentUserId: govAdmin.id
        };

        const updateExpenditure2Gov = {
            id: updateExpenditure1.id,
            amount: 100,
            currentUserId: govAdmin.id
        };

        const [updatedOne, updatedTwo, updatedOneGov, updatedTwoGov] = await Promise.all([
            updateExpenditureAsync(updateExpenditure1),
            updateExpenditureAsync(updateExpenditure2),
            updateExpenditureAsync(updateExpenditure1Gov),
            updateExpenditureAsync(updateExpenditure2Gov)
        ]);

        expect(updatedOne.amount === 500);
        expect(updatedTwo.name === 'foo');
        expect(updatedOneGov.name === 'bar');
        expect(updatedTwoGov.amount === 100);
    });

    it('Does not update an invalid expenditure for a campaign', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        const expenditure = await addExpenditureAsync(addExpenditureAttrs);

        expenditureRepository.update(expenditure.id, { status: ExpenditureStatus.SUBMITTED});

        const updateExpenditure = {
            id: expenditure.id,
            amount: 750,
            currentUserId: campaignStaff.id,
        };

        try {
            await updateExpenditureAsync(updateExpenditure);
        } catch (e) {
            expect(e.message).equal(
                'User does have permissions to change status on expenditure'
            );
        }
    });

    it('Does not update an expenditure for a campaign if the user lacks perms', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            purpose: PurposeType.CASH,
            payeeType: PayeeType.INDIVIDUAL,
            date: Date.now()
        };

        const expenditure = await addExpenditureAsync(addExpenditureAttrs);

        const updateExpenditure = {
            id: expenditure.id,
            amount: 750,
            currentUserId: campaignAdmin.id,
        };
        try {
            await updateExpenditureAsync(updateExpenditure);
        } catch (e) {
            expect(e.message).equal('User is not permitted to update expenditures for this campaign.');
        }
    });

    it('createExpenditureCommentAsync fails no user permission', async () => {
        const expenditure = await newExpenditureAsync(campaign2, government);
        let activities = await getActivityByExpenditureAsync(expenditure.id, 100, 0);
        expect(activities.data.length).to.equal(0);
        const user = await newActiveUserAsync();
        try {
            await createExpenditureCommentAsync({
                expenditureId: expenditure.id,
                currentUserId: user.id,
                comment: 'This is a comment'
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions');
        }
        activities = await getActivityByExpenditureAsync(expenditure.id, 100, 0);
        expect(activities.data.length).to.equal(0);
    });

    it('getActivityByExpenditureAsync success', async () => {
        const expenditure = await newExpenditureAsync(campaign1, government);
        let activities = await getActivityByExpenditureAsync(expenditure.id, 100, 0);
        expect(activities.data.length).to.equal(0);
        await createExpenditureCommentAsync({
            expenditureId: expenditure.id,
            currentUserId: campaignAdmin.id,
            comment: 'This is a comment'
        });
        activities = await getActivityByExpenditureAsync(expenditure.id, 100, 0);
        expect(activities.data.length).to.equal(1);
    });

    it('getActivityByExpenditureAsync fails cant find expenditure', async () => {
        let activities = await getActivityByExpenditureAsync(1000, 100, 0);
        expect(activities.data.length).to.equal(0);
        const user = await newActiveUserAsync();
        try {
            await createExpenditureCommentAsync({
                expenditureId: 1000,
                currentUserId: user.id,
                comment: 'This is a comment'
            });
        } catch (e) {
            expect(e.message).to.equal('Could not find any entity of type "Expenditure" matching: 1000');
        }
        activities = await getActivityByExpenditureAsync(1000, 100, 0);
        expect(activities.data.length).to.equal(0);
    });

    it('getExpenditureByIdAsync testme', async () => {
        const expenditure = await newExpenditureAsync(campaign1, government);
        const summary = await getExpenditureByIdAsync({ currentUserId: campaignAdmin.id, expenditureId: expenditure.id });

        expect(summary.id).to.equal(expenditure.id);
    });
});
