import * as libxml from 'libxmljs';
import { expect } from 'chai';
import { newCampaignAsync, newBulkContributionAsync, newGovernmentAsync, truncateAll, newBulkExpenditureAsync } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import { IContributionSummaryResults } from '../../models/entity/Contribution';
import { convertContributionsToXML, convertExpendituresToXML } from '../../models/converters';
import { campaignFinanceTransactionsSchema } from '../schemas/schemas';
import { IExpenditureSummaryResults } from '../../models/entity/Expenditure';

let government: Government;
let campaign: Campaign;
let bulkContributions: IContributionSummaryResults;
let bulkExpenditures: IExpenditureSummaryResults;
describe('Orestar bulk converter', () => {
  beforeEach(async () => {
    government = await newGovernmentAsync();
    campaign = await newCampaignAsync(government);
  });

  afterEach(async () => {
    await truncateAll();
  });

  describe('convertContributionsToXML', () => {

    beforeEach(async () => {
      bulkContributions = await newBulkContributionAsync(campaign, government);
    });

    it('successfully returns converted xml', async () => {
      const rawBulk = convertContributionsToXML(bulkContributions, 2);
      const xml = JSON.parse(rawBulk)[0];
      const xsd = campaignFinanceTransactionsSchema;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml);
      xmlDocValid.validate(xsdDoc);
      // console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  describe('convertExpendituresToXML', () => {

    beforeEach(async () => {
      bulkExpenditures = await newBulkExpenditureAsync(campaign, government);
    });

    it('successfully returns converted xml', async () => {
      const rawBulk = convertExpendituresToXML(bulkExpenditures, 2);
      const xml = JSON.parse(rawBulk)[0];
      const xsd = campaignFinanceTransactionsSchema;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml);
      xmlDocValid.validate(xsdDoc);
      // console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

});