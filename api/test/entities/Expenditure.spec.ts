import { expect } from 'chai';
import * as faker from 'faker';
import { getConnection } from 'typeorm';
import { Expenditure, ExpenditureSubType, ExpenditureType, PayeeType, ExpenditureStatus } from '../../models/entity/Expenditure';
import {newCampaignAsync, newExpenditureAsync, newGovernmentAsync, truncateAll} from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Expenditure', () => {
    before(async () => {
        repository = getConnection('default').getRepository('Expenditure');
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
    });

    after(async () => {
        await truncateAll();
    });

    describe('validations', () => {

        it('isDefined Columns', async () => {
            const newRecord = new Expenditure();
            await newRecord.validateAsync();
            expect(newRecord.errors.length).to.equal(15);
            const isDefinedFields = newRecord.errors.map(item => item.property);
            expect(isDefinedFields).to.deep.equal([ 'date',
                'type',
                'subType',
                'payeeType',
                'name',
                'address1',
                'city',
                'state',
                'zip',
                'amount',
                'description',
                'status',
                'campaignId',
                'governmentId',
                'amount' ]);
        });

        it('validateType EXPENDITURE', async () => {
            const newRecord = new Expenditure();
            newRecord.type = ExpenditureType.EXPENDITURE;
            newRecord.subType = ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "expenditure" must have a subType of "accounts_payable, cash_expenditure or personal_expenditure"')
        });

        it('validateType OTHER', async () => {
            const newRecord = new Expenditure();
            newRecord.type = ExpenditureType.OTHER;
            newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "other"  must have a subType of "accounts_payable or cash_balance_adjustment"')
        });

        it('validateAmount', async () => {
            const newRecord = new Expenditure();
            newRecord.type = ExpenditureType.EXPENDITURE;
            newRecord.subType = ExpenditureSubType.CASH_EXPENDITURE;
            newRecord.payeeType = PayeeType.INDIVIDUAL;
            newRecord.amount = 0;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateAmount();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('amount');
        });
    });

    describe('CRUD operations', () => {

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
            newRecord.description = 'Pays for something';
            await newRecord.validateAsync();
            expect(newRecord.errors.length).to.equal(0);
            expect(await repository.count()).to.equal(0);
            await repository.save(newRecord);
            expect(await repository.count()).to.equal(1);
        });

        it('delete', async () => {
            const newRecord = newExpenditureAsync(campaign, government);
            const count1 = await repository.count();
            await repository.delete(newRecord);
            const count2 = await repository.count();
            expect(count2 + 1).to.equal(count1);
        });

        it('update', async () => {
            const newRecord = await newExpenditureAsync(campaign, government);
            expect(newRecord.name).to.not.equal('Dan');
            const found = await repository.findOne(newRecord.id);
            await repository.update(found.id, {name: 'Dan'});
            const changed = await repository.findOne(newRecord.id);
            expect(changed.name).to.equal('Dan');
        });
    });
});

