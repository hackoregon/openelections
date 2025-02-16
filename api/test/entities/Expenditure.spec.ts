import { faker } from '@faker-js/faker';
import db from '../../models/db';
import {
    Expenditure,
    ExpenditureStatus,
    ExpenditureSubType,
    ExpenditureType,
    getExpendituresByGovernmentIdAsync,
    getExpenditureSummaryByStatusAsync,
    PayeeType,
    PaymentMethod,
    PurposeType,
} from '../../models/entity/Expenditure';
import { newCampaignAsync, newExpenditureAsync, newGovernmentAsync, truncateAll } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import { IGetExpenditureAttrs } from '../../services/expenditureService';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Expenditure', () => {
    beforeEach(async () => {
        const dataSource = await db();
        repository = dataSource.getRepository('Expenditure');
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('isDefined Columns', async () => {
        const newRecord = new Expenditure();
        await newRecord.validateAsync();
        expect(newRecord.errors.length).toEqual(10);
        const isDefinedFields = newRecord.errors.map((item) => item.property);
        expect(isDefinedFields).toEqual([
            'date',
            'type',
            'subType',
            'payeeType',
            'name',
            'amount',
            'status',
            'campaignId',
            'governmentId',
            'amount',
        ]);
    });

    it('validateType EXPENDITURE', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        expect(newRecord.errors.length).toEqual(0);
        await newRecord.validateType();
        expect(newRecord.errors.length).toEqual(1);
        expect(newRecord.errors[0].property).toEqual('subType');
        expect(newRecord.errors[0].constraints.notAllowed).toEqual(
            'Type "expenditure" must have a subType of "accounts_payable, cash_expenditure or personal_expenditure"'
        );
    });

    it('validateType OTHER', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.OTHER;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        expect(newRecord.errors.length).toEqual(0);
        await newRecord.validateType();
        expect(newRecord.errors.length).toEqual(1);
        expect(newRecord.errors[0].property).toEqual('subType');
        expect(newRecord.errors[0].constraints.notAllowed).toEqual(
            'Type "other"  must have a subType of "accounts_payable or cash_balance_adjustment"'
        );
    });

    it('validateAmount', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        newRecord.payeeType = PayeeType.INDIVIDUAL;
        newRecord.amount = 0;
        expect(newRecord.errors.length).toEqual(0);
        await newRecord.validateAmount();
        expect(newRecord.errors.length).toEqual(1);
        expect(newRecord.errors[0].property).toEqual('amount');
    });

    it('create', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.payeeType = PayeeType.INDIVIDUAL;
        newRecord.amount = parseInt(faker.finance.amount({ min: 0, max: 500, dec: 2 }));
        newRecord.address1 = faker.location.streetAddress();
        newRecord.zip = '97214';
        newRecord.city = 'Portland';
        newRecord.state = 'OR';
        newRecord.name = faker.person.fullName();
        newRecord.government = government;
        newRecord.campaign = campaign;
        newRecord.status = ExpenditureStatus.DRAFT;
        newRecord.date = new Date();
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        await newRecord.validateAsync();
        expect(newRecord.errors.length).toEqual(0);
        expect(await repository.count()).toEqual(0);
        await repository.save(newRecord);
        expect(await repository.count()).toEqual(1);
    });

    it('update', async () => {
        const newRecord = await newExpenditureAsync(campaign, government);
        expect(newRecord.name).not.toEqual('Dan');
        const found = await repository.findOne({ where: { id: newRecord.id } });
        await repository.update(found.id, { name: 'Dan' });
        const changed = await repository.findOne({ where: { id: newRecord.id } });
        expect(changed.name).toEqual('Dan');
    });

    it('getExpenditureSummaryByStatusAsync governmentId', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [exp1, exp2, exp3, exp4] = await Promise.all([
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign2, government),
        ]);
        await repository.update(exp1.id, { status: ExpenditureStatus.SUBMITTED, amount: 1 });
        await repository.update(exp2.id, { status: ExpenditureStatus.IN_COMPLIANCE, amount: 1 });
        await repository.update(exp3.id, { status: ExpenditureStatus.OUT_OF_COMPLIANCE, amount: 1 });
        await repository.update(exp4.id, { amount: 1 });
        const summary = await getExpenditureSummaryByStatusAsync({ governmentId: government.id });
        expect(summary.length).toEqual(4);
    });

    it('getExpenditureSummaryByStatusAsync campaign', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [exp1, exp2, exp3, exp4] = await Promise.all([
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign2, government),
        ]);
        await repository.update(exp1.id, { status: ExpenditureStatus.SUBMITTED, amount: 1 });
        await repository.update(exp2.id, { status: ExpenditureStatus.IN_COMPLIANCE, amount: 1 });
        await repository.update(exp3.id, { status: ExpenditureStatus.OUT_OF_COMPLIANCE, amount: 1 });
        await repository.update(exp4.id, { amount: 1 });
        let summary = await getExpenditureSummaryByStatusAsync({ campaignId: campaign2.id });
        expect(summary).toEqual([
            {
                amount: 1,
                status: 'draft',
                total: 1,
            },
        ]);

        summary = await getExpenditureSummaryByStatusAsync({ campaignId: campaign.id });
        expect(summary.length).toEqual(3);
    });

    it('getExpendituresByGovernmentIdAsync', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [exp1, exp2, exp3, exp4] = await Promise.all([
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign2, government),
        ]);
        await repository.update(exp1.id, { status: ExpenditureStatus.SUBMITTED, amount: 1 });
        await repository.update(exp2.id, { status: ExpenditureStatus.IN_COMPLIANCE, amount: 1 });
        await repository.update(exp3.id, { status: ExpenditureStatus.OUT_OF_COMPLIANCE, amount: 1 });
        await repository.update(exp4.id, { amount: 1 });

        const options: IGetExpenditureAttrs = {
            page: 1,
            perPage: 10,
            campaignId: campaign.id,
            status: ExpenditureStatus.SUBMITTED,
            sort: { field: 'date', direction: 'ASC' },
            format: 'json',
        };

        const result = await getExpendituresByGovernmentIdAsync(government.id, options);
        console.log(JSON.stringify(result));
        expect(result.data.length).toEqual(1);
        expect(result.data[0].status).toEqual(ExpenditureStatus.SUBMITTED);
        expect(result.total).toEqual(1);
        expect(result.page).toEqual(1);
        expect(result.perPage).toEqual(10);
    });
});
