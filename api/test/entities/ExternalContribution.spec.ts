import { truncateAll, newExternalContributionAsync } from '../factories';
import {
    ExternalContribution,
    ExternalContributionSubType,
    getExternalContributionsGeoJsonAsync,
} from '../../models/entity/ExternalContribution';
import { ContributionType, ContributorType } from '../../models/entity/Contribution';
import db from '../../models/db';

let repository: any;

describe('External Contribution', () => {
    beforeEach(async () => {
        const dataSource = await db();
        repository = dataSource.getRepository('external_contributions');
    });
    afterEach(async () => {
        await truncateAll();
    });
    describe('validations', () => {
        it('isDefined Columns', async () => {
            const newRecord = new ExternalContribution();
            await newRecord.validateAsync();
            expect(newRecord.errors.length).toEqual(11);
            const isDefinedFields = newRecord.errors.map((item) => item.property);
            expect(isDefinedFields).toEqual([
                'orestarOriginalId',
                'orestarTransactionId',
                'type',
                'subType',
                'contributorType',
                'address1',
                'city',
                'state',
                'zip',
                'date',
                'name',
            ]);
        });
        it('validateType CONTRIBUTION', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ExternalContributionSubType.ITEM_REFUND;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('subType');
            expect(newRecord.errors[0].constraints.notAllowed).toEqual(
                'Type "contribution" must have a valid subType of "cash or an inkind value"'
            );
        });

        it('validatePaymentType CONTRIBUTION CASH', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ExternalContributionSubType.CASH;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('name');
            expect(newRecord.errors[0].constraints.isDefined).toEqual('name should not be null or undefined');
        });
        it('validateType OTHER', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.OTHER;
            newRecord.subType = ExternalContributionSubType.CASH;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateType();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('subType');
            expect(newRecord.errors[0].constraints.notAllowed).toEqual(
                'Type "other" cannot have a subType of "cash or inkind value"'
            );
        });
        it('validateName Individual', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ExternalContributionSubType.CASH;
            newRecord.contributorType = ContributorType.INDIVIDUAL;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('name');
        });
        it('validateName Family', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ExternalContributionSubType.CASH;
            newRecord.contributorType = ContributorType.FAMILY;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('name');
        });

        it('validateName not Individual', async () => {
            const newRecord = new ExternalContribution();
            newRecord.type = ContributionType.CONTRIBUTION;
            newRecord.subType = ExternalContributionSubType.CASH;
            newRecord.contributorType = ContributorType.BUSINESS;
            expect(newRecord.errors.length).toEqual(0);
            await newRecord.validateName();
            expect(newRecord.errors.length).toEqual(1);
            expect(newRecord.errors[0].property).toEqual('name');
        });
    });
    describe('Test DB interactions', () => {
        it('getExternalContributionsGeoJsonAsync', async () => {
            const [contr1, contr2] = await Promise.all([
                newExternalContributionAsync(),
                newExternalContributionAsync(),
            ]);
            await repository.update(contr2.orestarOriginalId, {
                orestarTransactionId: '500',
            });
            const contributions = await getExternalContributionsGeoJsonAsync();
            expect(contributions.type).toEqual('FeatureCollection');
            expect(contributions.features.length).toEqual(1);
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
                'campaignId',
                'campaignName',
                'officeSought',
                'batchId',
                'isMiscCashContributionUnder100',
            ]);
        });
    });
});
