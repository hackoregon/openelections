import { expect } from 'chai';
import * as faker from 'faker';
import { getConnection } from 'typeorm';
import {
    Expenditure,
    ExpenditureStatus,
    ExpenditureSubType,
    ExpenditureType,
    getExpenditureSummaryByStatusAsync,
    PayeeType,
    PaymentMethod,
    PurposeType
} from '../../models/entity/Expenditure';
import { newCampaignAsync, newExpenditureAsync, newGovernmentAsync, truncateAll } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Expenditure', () => {
    beforeEach(async () => {
        repository = getConnection('default').getRepository('Expenditure');
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('isDefined Columns', async () => {
        const newRecord = new Expenditure();
        await newRecord.validateAsync();
        expect(newRecord.errors.length).to.equal(10);
        const isDefinedFields = newRecord.errors.map(item => item.property);
        expect(isDefinedFields).to.deep.equal(['date',
            'type',
            'subType',
            'payeeType',
            'name',
            'amount',
            'status',
            'campaignId',
            'governmentId',
            'amount']);
    });

    it('validateType EXPENDITURE', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        expect(newRecord.errors.length).to.equal(0);
        await newRecord.validateType();
        expect(newRecord.errors.length).to.equal(1);
        expect(newRecord.errors[0].property).to.equal('subType');
        expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "expenditure" must have a subType of "accounts_payable, cash_expenditure or personal_expenditure"');
    });

    it('validateType OTHER', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.OTHER;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        expect(newRecord.errors.length).to.equal(0);
        await newRecord.validateType();
        expect(newRecord.errors.length).to.equal(1);
        expect(newRecord.errors[0].property).to.equal('subType');
        expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "other"  must have a subType of "accounts_payable or cash_balance_adjustment"');
    });

    it('validateAmount', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        newRecord.payeeType = PayeeType.INDIVIDUAL;
        newRecord.amount = 0;
        expect(newRecord.errors.length).to.equal(0);
        await newRecord.validateAmount();
        expect(newRecord.errors.length).to.equal(1);
        expect(newRecord.errors[0].property).to.equal('amount');
    });


    it('create', async () => {
        const newRecord = new Expenditure();
        newRecord.type = ExpenditureType.EXPENDITURE;
        newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
        newRecord.payeeType = PayeeType.INDIVIDUAL;
        newRecord.amount = faker.finance.amount(0, 500, 2);
        newRecord.address1 = faker.address.streetAddress();
        newRecord.zip = '97214';
        newRecord.city = 'Portland';
        newRecord.state = 'OR';
        newRecord.name = faker.name.findName();
        newRecord.government = government;
        newRecord.campaign = campaign;
        newRecord.status = ExpenditureStatus.DRAFT;
        newRecord.date = new Date();
        newRecord.paymentMethod = PaymentMethod.CASH;
        newRecord.purpose = PurposeType.CASH;
        await newRecord.validateAsync();
        expect(newRecord.errors.length).to.equal(0);
        expect(await repository.count()).to.equal(0);
        await repository.save(newRecord);
        expect(await repository.count()).to.equal(1);
    });

    it('update', async () => {
        const newRecord = await newExpenditureAsync(campaign, government);
        expect(newRecord.name).to.not.equal('Dan');
        const found = await repository.findOne(newRecord.id);
        await repository.update(found.id, {name: 'Dan'});
        const changed = await repository.findOne(newRecord.id);
        expect(changed.name).to.equal('Dan');
    });

    it('getExpenditureSummaryByStatusAsync governmentId', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [exp1, exp2, exp3, exp4] = await Promise.all([
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign2, government),
        ]);
        await repository.update(exp1.id, {status: ExpenditureStatus.SUBMITTED, amount: 1});
        await repository.update(exp2.id, {status: ExpenditureStatus.IN_COMPLIANCE, amount: 1});
        await repository.update(exp3.id, {status: ExpenditureStatus.OUT_OF_COMPLIANCE, amount: 1});
        await repository.update(exp4.id, {amount: 1});
        const summary = await getExpenditureSummaryByStatusAsync({governmentId: government.id});
        expect(summary.length).to.equal(4);
    });

    it('getExpenditureSummaryByStatusAsync campaign', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [exp1, exp2, exp3, exp4] = await Promise.all([
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign, government),
            newExpenditureAsync(campaign2, government),
        ]);
        await repository.update(exp1.id, {status: ExpenditureStatus.SUBMITTED, amount: 1});
        await repository.update(exp2.id, {status: ExpenditureStatus.IN_COMPLIANCE, amount: 1});
        await repository.update(exp3.id, {status: ExpenditureStatus.OUT_OF_COMPLIANCE, amount: 1});
        await repository.update(exp4.id, {amount: 1});
        let summary = await getExpenditureSummaryByStatusAsync({campaignId: campaign2.id});
        expect(summary).to.deep.equal([
            {
                'amount': 1,
                'status': 'draft',
                'total': 1,
            }]);

        summary = await getExpenditureSummaryByStatusAsync({campaignId: campaign.id});
        expect(summary.length).to.equal(3);
    });
});

