import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { truncateAll, newExternalContributionAsync } from '../factories';
import {
  ExternalContribution,
  ExternalContributionSubType, getExternalContributionsGeoJsonAsync
} from '../../models/entity/ExternalContribution';
import { ContributionType, ContributorType } from '../../models/entity/Contribution';

let repository: any;

describe('External Contribution', () => {
  before(() => {
    repository = getConnection('default').getRepository('external_contributions');
  });
  afterEach(async () => {
    await truncateAll();
  });
  describe('validations', async () => {
    it('isDefined Columns', async () => {
      const newRecord = new ExternalContribution();
      await newRecord.validateAsync();
      expect(newRecord.errors.length).to.equal(11);
      const isDefinedFields = newRecord.errors.map(item => item.property);
      expect(isDefinedFields).to.deep.equal([
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
      expect(newRecord.errors.length).to.equal(0);
      await newRecord.validateType();
      expect(newRecord.errors.length).to.equal(1);
      expect(newRecord.errors[0].property).to.equal('subType');
      expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "contribution" must have a valid subType of "cash or an inkind value"');
    });

    it('validatePaymentType CONTRIBUTION CASH', async () => {
      const newRecord = new ExternalContribution();
      newRecord.type = ContributionType.CONTRIBUTION;
      newRecord.subType = ExternalContributionSubType.CASH;
      expect(newRecord.errors.length).to.equal(0);
      await newRecord.validateName();
      expect(newRecord.errors.length).to.equal(1);
      expect(newRecord.errors[0].property).to.equal('name');
      expect(newRecord.errors[0].constraints.isDefined).to.equal('name should not be null or undefined');
    });
    it('validateType OTHER', async () => {
      const newRecord = new ExternalContribution();
      newRecord.type = ContributionType.OTHER;
      newRecord.subType = ExternalContributionSubType.CASH;
      expect(newRecord.errors.length).to.equal(0);
      await newRecord.validateType();
      expect(newRecord.errors.length).to.equal(1);
      expect(newRecord.errors[0].property).to.equal('subType');
      expect(newRecord.errors[0].constraints.notAllowed).to.equal('Type "other" cannot have a subType of "cash or inkind value"');
    });
    it('validateName Individual', async () => {
      const newRecord = new ExternalContribution();
      newRecord.type = ContributionType.CONTRIBUTION;
      newRecord.subType = ExternalContributionSubType.CASH;
      newRecord.contributorType = ContributorType.INDIVIDUAL;
      expect(newRecord.errors.length).to.equal(0);
      await newRecord.validateName();
      expect(newRecord.errors.length).to.equal(1);
      expect(newRecord.errors[0].property).to.equal('name');
    });
    it('validateName Family', async () => {
      const newRecord = new ExternalContribution();
      newRecord.type = ContributionType.CONTRIBUTION;
      newRecord.subType = ExternalContributionSubType.CASH;
      newRecord.contributorType = ContributorType.FAMILY;
      expect(newRecord.errors.length).to.equal(0);
      await newRecord.validateName();
      expect(newRecord.errors.length).to.equal(1);
      expect(newRecord.errors[0].property).to.equal('name');
    });

    it('validateName not Individual', async () => {
        const newRecord = new ExternalContribution();
        newRecord.type = ContributionType.CONTRIBUTION;
        newRecord.subType = ExternalContributionSubType.CASH;
        newRecord.contributorType = ContributorType.BUSINESS;
        expect(newRecord.errors.length).to.equal(0);
        await newRecord.validateName();
        expect(newRecord.errors.length).to.equal(1);
        expect(newRecord.errors[0].property).to.equal('name');
    });
  });
  describe('Test DB interactions', () => {
    it('getExternalContributionsGeoJsonAsync', async () => {
      const [contr1, contr2] = await Promise.all([
          newExternalContributionAsync(),
          newExternalContributionAsync(),
      ]);
      await repository.update(contr2.orestarOriginalId, {
        orestarTransactionId: '500'
      });
      const contributions = await getExternalContributionsGeoJsonAsync();
      expect(contributions.type).to.equal('FeatureCollection');
      expect(contributions.features.length).to.equal(2);
      expect(contributions.features[0].type).to.equal('Feature');
      expect(Object.keys(contributions.features[0].properties)).to.deep.equal([
          'type', 'city', 'state', 'zip', 'amount', 'contributorType', 'contributionType', 'contributionSubType', 'date', 'contributorName', 'campaignId', 'campaignName', 'officeSought'
      ]);
    });
  });
});