import { expect } from 'chai';
import { getConnection } from 'typeorm';
import {
    Contribution, ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    getContributionsSummaryByStatusAsync
} from '../../models/entity/Contribution';
import {
    newCampaignAsync,
    newContributionAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import { PaymentMethod } from '../../models/entity/Expenditure';

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
            newRecord.subType = ContributionSubType.ITEM_REFUND;
            newRecord.paymentMethod = PaymentMethod.CASH;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "contribution" must have a valid subType of "cash or an inkind value"');
        });

        it('validatePaymentType CONTRIBUTION CASH', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validatePaymentType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('paymentMethod');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "contribution" with subType "cash" must have a paymentMethod');
        });

        it('validateType OTHER', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.OTHER;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('subType');
            expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "other" cannot have a subType of "cash or inkind value"');
        });

        it('validateName Individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
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
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.FAMILY;
            expect(newRecord.errors.length).to.equal(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('name');
        });

        it('validateMatchAmount', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            newRecord.paymentMethod = PaymentMethod.CASH;
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
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.isInKind()).to.be.true;
            expect(!newRecord.inKindType).to.be.true;
            await newRecord.validateInKindType();
            expect(newRecord.errors.length).to.equal(1);
            expect(newRecord.errors[0].property).to.equal('inKindType');
        });
    });


    it('getContributionsSummaryByStatusAsync governmentId', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [contr1, contr2, contr3, contr4] = await Promise.all([
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign2, government),
        ]);
        await repository.update(contr1.id, {status: ContributionStatus.SUBMITTED, amount: 1});
        await repository.update(contr2.id, {status: ContributionStatus.PROCESSED, amount: 1});
        await repository.update(contr3.id, {status: ContributionStatus.ARCHIVED, amount: 1});
        await repository.update(contr4.id, {amount: 1});
        const summary = await getContributionsSummaryByStatusAsync({governmentId: government.id});
        expect(summary.map(item => item.amount)).to.deep.equal([1, 1, 1]);
        expect(summary.map(item => item.matchAmount)).to.deep.equal([0, 0, 0]);
        expect(summary.map(item => item.status)).to.deep.equal(['Draft', 'Submitted', 'Processed']);
        expect(summary.map(item => item.total)).to.deep.equal([1, 1, 1]);
    });

    it('getContributionsSummaryByStatusAsync campaign', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [contr1, contr2, contr3, contr4] = await Promise.all([
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign2, government),
        ]);
        await repository.update(contr1.id, {status: ContributionStatus.SUBMITTED, amount: 1});
        await repository.update(contr2.id, {status: ContributionStatus.PROCESSED, amount: 1});
        await repository.update(contr3.id, {status: ContributionStatus.ARCHIVED, amount: 1});
        await repository.update(contr4.id, {amount: 1});
        let summary = await getContributionsSummaryByStatusAsync({campaignId: campaign2.id});
        expect(summary.map(item => item.amount)).to.deep.equal([1]);
        expect(summary.map(item => item.matchAmount)).to.deep.equal([0]);
        expect(summary.map(item => item.status)).to.deep.equal(['Draft']);
        expect(summary.map(item => item.total)).to.deep.equal([1]);

        summary = await getContributionsSummaryByStatusAsync({campaignId: campaign.id});
        expect(summary.map(item => item.amount)).to.deep.equal([1, 1]);
        expect(summary.map(item => item.matchAmount)).to.deep.equal([0, 0]);
        expect(summary.map(item => item.status)).to.deep.equal(['Submitted', 'Processed']);
        expect(summary.map(item => item.total)).to.deep.equal([1, 1]);
    });
});

