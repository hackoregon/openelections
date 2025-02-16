import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    getContributionsGeoJsonAsync,
    getContributionsSummaryByStatusAsync,
} from '../../models/entity/Contribution';
import { newCampaignAsync, newContributionAsync, newGovernmentAsync, truncateAll } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import { PaymentMethod } from '../../models/entity/Expenditure';
import db from '../../models/db';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Contribution', () => {
    beforeEach(async () => {
        const dataSource = await db();
        repository = dataSource.getRepository('Contribution');
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
            expect(newRecord.errors.length).toEqual(12);
            const isDefinedFields = newRecord.errors.map((item) => item.property);
            expect(isDefinedFields).toEqual([
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
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('subType');
            expect(newRecord.errors[0].constraints.notAllowed).toEqual(
                'Type "contribution" must have a valid subType of "cash or an inkind value"'
            );
        });

        it('validatePaymentType CONTRIBUTION CASH', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validatePaymentType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('paymentMethod');
            expect(newRecord.errors[0].constraints.notAllowed).toEqual(
                'Type "contribution" with subType "cash" must have a paymentMethod'
            );
        });

        it('validateType OTHER', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.OTHER;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('subType');
            expect(newRecord.errors[0].constraints.notAllowed).toEqual(
                'Type "other" cannot have a subType of "cash or inkind value"'
            );
        });

        it('validateName Individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(2);
            expect(newRecord.errors[0].property).toEqual('lastName');
            expect(newRecord.errors[1].property).toEqual('firstName');
        });

        it('validateName Family', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.FAMILY;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(2);
            expect(newRecord.errors[0].property).toEqual('lastName');
            expect(newRecord.errors[1].property).toEqual('firstName');
        });

        it('validateName not Individual', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.BUSINESS;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('name');
        });

        it('validateMatchAmount', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.amount = 1.0;
            newRecord.matchAmount = 10.0;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateMatchAmount();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('matchAmount');
        });

        it('isInKind && validateInKindType', async () => {
            const newRecord = new Contribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ContributionSubType.INKIND_CONTRIBUTION;
            newRecord.paymentMethod = PaymentMethod.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.isInKind()).toBeTruthy();
            expect(!newRecord.inKindType).toBeTruthy();
            await newRecord.validateInKindType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('inKindType');
        });
    });

    it('getContributionsSummaryByStatusAsync governmentId', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [contr1, contr2, contr3, contr4, contr5] = await Promise.all([
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign2, government),
            newContributionAsync(campaign2, government),
        ]);
        await repository.update(contr1.id, { status: ContributionStatus.SUBMITTED, amount: 1 });
        await repository.update(contr2.id, { status: ContributionStatus.PROCESSED, amount: 1 });
        await repository.update(contr3.id, { status: ContributionStatus.ARCHIVED, amount: 1 });
        await repository.update(contr4.id, { amount: 1 });
        await repository.update(contr5.id, { status: ContributionStatus.AWAITING, amount: 1 });
        const summary = await getContributionsSummaryByStatusAsync({ governmentId: government.id });
        expect(summary.map((item) => item.amount)).toEqual([1, 1, 1, 1]);
        expect(summary.map((item) => item.matchAmount)).toEqual([0, 0, 0, 0]);
        expect(summary.map((item) => item.status)).toEqual(
            expect.arrayContaining(['Draft', 'Submitted', 'Processed', 'Awaiting'])
        );
        expect(summary.map((item) => item.total)).toEqual([1, 1, 1, 1]);
    });

    it('getContributionsSummaryByStatusAsync campaign', async () => {
        const campaign2 = await newCampaignAsync(government);
        const [contr1, contr2, contr3, contr4] = await Promise.all([
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign2, government),
        ]);
        await repository.update(contr1.id, { status: ContributionStatus.SUBMITTED, amount: 1 });
        await repository.update(contr2.id, { status: ContributionStatus.PROCESSED, amount: 1 });
        await repository.update(contr3.id, { status: ContributionStatus.ARCHIVED, amount: 1 });
        await repository.update(contr4.id, { amount: 1 });
        let summary = await getContributionsSummaryByStatusAsync({ campaignId: campaign2.id });
        expect(summary.map((item) => item.amount)).toEqual([1]);
        expect(summary.map((item) => item.matchAmount)).toEqual([0]);
        expect(summary.map((item) => item.status)).toEqual(['Draft']);
        expect(summary.map((item) => item.total)).toEqual([1]);

        summary = await getContributionsSummaryByStatusAsync({ campaignId: campaign.id });
        expect(summary.map((item) => item.amount)).toEqual([1, 1]);
        expect(summary.map((item) => item.matchAmount)).toEqual([0, 0]);
        expect(summary.map((item) => item.status)).toEqual(expect.arrayContaining(['Submitted', 'Processed']));
        expect(summary.map((item) => item.total)).toEqual([1, 1]);
    });

    it('getContributionsGeoJsonAsync testme', async () => {
        const [contr1, contr2, contr3, contr4] = await Promise.all([
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
            newContributionAsync(campaign, government),
        ]);
        await repository.update(contr2.id, { status: ContributionStatus.PROCESSED });
        await repository.update(contr3.id, { status: ContributionStatus.SUBMITTED });
        await repository.update(contr4.id, { status: ContributionStatus.ARCHIVED });
        const contributions = await getContributionsGeoJsonAsync();
        expect(contributions.type).toEqual('FeatureCollection');
        expect(contributions.features.length).toEqual(2);
        expect(contributions.features[0].type).toEqual('Feature');
        expect(Object.keys(contributions.features[0].properties)).toEqual([
            'type',
            'city',
            'state',
            'zip',
            'amount',
            'contributorType',
            'contributionType',
            'contributionSubType',
            'date',
            'matchAmount',
            'oaeType',
            'campaignId',
            'campaignName',
            'officeSought',
            'batchId',
            'isMiscCashContributionUnder100',
        ]);
    });
});
