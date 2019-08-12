import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Contribution, ContributionSubType, ContributionType, ContributorType } from '../../models/entity/Contribution';
import { newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Contribution', () => {
    before(() => {
        repository = getConnection('default').getRepository('Contribution');
    });

    beforeEach(async () => {
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('validations', () => {
        it('isDefined Columns', async () => {
            const newRecord = new Contribution();
            await newRecord.validateAsync();
            expect(newRecord.errors.length).to.equal(12);
            const isDefinedFields = newRecord.errors.map(item => item.property);
            expect(isDefinedFields).to.deep.equal([
                'type',
                'subType',
                'contributorType',
                'address1',
                'city',
                'state',
                'zip',
                'status',
                'date',
                'campaignId',
                'governmentId',
                'name',
            ]);
        });

        it('validateType CONTRIBUTION', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.INKIND_CONTRIBUTION;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "contribution" must have a subType of "cash"');
        });

        it('validateType OTHER', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.OTHER;
            newRecord.subType = ContributionSubType.CASH;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "other" cannot have a subType of "cash"');
        });

        it('validateName Individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).to.equal(2);
            expect(newRecord.errors[0].property).to.equal('lastName');
            expect(newRecord.errors[1].property).to.equal('firstName');
        });

        it('validateName not Individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.FAMILY;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('name');
        });

        it('validateAmount', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            newRecord.submitForMatch = true;
            newRecord.amount = 0;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateAmount();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('amount');
        });

        it('validateSubmitForMatch not cash', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.INKIND_CONTRIBUTION;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            newRecord.submitForMatch = true;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateSubmitForMatch();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('submitForMatch');
        });

        it('validateSubmitForMatch not an individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.INKIND_CONTRIBUTION;
            newRecord.contributorType = ContributorType.FAMILY;
            newRecord.submitForMatch = true;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateSubmitForMatch();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('submitForMatch');
        });

        it('validateMatchAmount', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            newRecord.submitForMatch = true;
            newRecord.amount = 1.00;
            newRecord.matchAmount = 10.00;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateMatchAmount();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('matchAmount');
        });

        it('isInKind && validateInKindType', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.INKIND_CONTRIBUTION;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.isInKind()).to.be.true;
            expect(!newRecord.inKindType).to.be.true;
            await newRecord.validateInKindType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('inKindType');
        });
    });
});

