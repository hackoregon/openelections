import {expect} from 'chai';
import {getConnection} from 'typeorm';
import * as libxml from 'libxmljs';
import {
  zipSchema,
  citySchema,
  stateSchema,
  street1Schema,
  street2Schema,
  zipPlusFourSchema,
  fgnPostCodeSchema,
  countryCodeSchema,
  countySchema,
  amountSchema,
  associatedTranSchema,
  associatedIdSchema,
  associatedCompleteSchema,
  campaignFinanceTransactionsSchema,
  contactSchema,
  contactIdSchema,
  contactTypeSchema,
  contactOccupationSchema,
  contactNameSchema,
  contactBusinessNameSchema,
  contactNameCommitteeSchema,
  cosignerSchema,
  employmentSchema,
  expendForSchema,
  individualNameSchema,
  phoneSchema,
  transactionSchema,
  tranPurposeSchema,
  transactionDescriptionSchema,
  aggregateAmountSchema,
  paymentMethodSchema,
  dateSchema,
  checkNoSchema,
  interestRateSchema,
  paymentScheduleSchema,
  occupationLetterDateSchema,
  transactionNotesSchema
} from '../schemas/schemas';
import {newCampaignAsync, newContributionAsync, newGovernmentAsync, truncateAll} from '../factories';
import {Government} from '../../models/entity/Government';
import {Campaign} from '../../models/entity/Campaign';
import OrestarContributionConverter from '../../models/converters/orestarContributionConverter';
import { ContributionSubType, InKindDescriptionType } from '../../models/entity/Contribution';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('Orestar contribution converter', () => {

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

  describe('street1 schema', () => {

    it('confirms passing street1 schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = street1Schema;
      const xml_valid = xml.street1();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms fail of street1 schema', async () => {
      const xsd = street1Schema;
      const xml_valid = '';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('street2 schema', () => {

    it('confirms passing street2 schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = street2Schema;
      const xml_valid = xml.street2();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of street2 schema', async () => {
      const xsd = street2Schema;
      const xml_valid = `<street2>`;
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('city schema', () => {

    it('confirms passing city schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = citySchema;
      const xml_valid = xml.city();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failing city schema', async () => {
      const xsd = citySchema;
      const xml_valid = '<city></city>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('state schema', () => {

    it('confirms passing state schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = stateSchema;
      const xml_valid = xml.state();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failing of state schema', async () => {
      const xsd = stateSchema;
      const xml_valid = '<state>MDIDIDI</state>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('zip schema', () => {

    it('confirms passing zip schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = zipSchema;
      const xml_valid = xml.zip();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of zip schema', async () => {
      const xsd = zipSchema;
      const xml_valid = '<zip>blahdhdhd</zip>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('zip plus schema', () => {

    it('confirms passing zip plus four schema', async () => {
      const xsd = zipPlusFourSchema;
      const xml_valid = '<zip-plus4>4565</zip-plus4>';
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing zip plus four method', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.zip = `63334-2030`;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = zipPlusFourSchema;
      const xml_valid = xml.zipPlusFour();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of zip plus four method', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.zip = `63334-20303`; // too many characters
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = zipPlusFourSchema;
      xml.zipPlusFour();
      expect(libxml.parseXml.bind(xsd)).to.throw();
    });

    it('confirms passing zip plus four schema', async () => {
      const xsd = zipPlusFourSchema;
      const xml_valid = '<zip-plus4>45654</zip-plus4>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('foreign post code schema', () => {

    it('confirms passing foreign post code schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = fgnPostCodeSchema;
      const xml_valid = xml.fgnPostCode();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing foreign post code schema', async () => {
      const xsd = fgnPostCodeSchema;
      const xml_valid = '<fgn-post-code></fgn-post-code>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('country code schema', () => {

    it('confirms passing country code schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = countryCodeSchema;
      const xml_valid = xml.countryCode();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failing of country code schema', async () => {
      const xsd = countryCodeSchema;
      const xml_valid = '<country-code>asdfasd</country-code>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('county schema', () => {

    it('confirms passing county schema', async () => {
      const xsd = countySchema;
      const xml_valid = '<county>Washington</county>';
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing county method', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.county = 'Multnomah';
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = countySchema;
      const xml_valid = xml.county();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing county method', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = countySchema;
      const xml_valid = xml.county();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('amount schema', () => {

    it('confirms passing amount schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = amountSchema;
      const xml_valid = xml.amount();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of amount schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      (contribution as any).amount = 'nope';
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = amountSchema;
      const xml_valid = xml.amount();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('associated-tran schema', () => {

    it('confirms passing associated-tran schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = associatedTranSchema;
      const xml_valid = xml.associatedTran();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of associated-tran schema', async () => {
      const xsd = associatedTranSchema;
      const xml_valid = 'nope';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('associated id', () => {

    it('confirms passing associated id schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = associatedIdSchema;
      const xml_valid = xml.associatedId();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of associated id schema', async () => {
      const xsd = associatedIdSchema;
      const xml_valid = '<id>over30charactersaksdfkajsdfkjla</id>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('associated complete schema', () => {

    it('confirms passing associated complete? schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = associatedCompleteSchema;
      const xml_valid = xml.associatedComplete();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure associated complete? schema', async () => {
      const xsd = associatedCompleteSchema;
      const xml_valid = '<complete>NOPE</complete>';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('campaign-finance-transaction schema', () => {

    it('confirms passing campaign-finance-transactions schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = campaignFinanceTransactionsSchema;
      const xml_valid = xml.campaignFinanceTransactions();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of campaign-finance-transactions schema: filer-id missing', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, ('NOPE' as any));
      const xsd = campaignFinanceTransactionsSchema;
      const xml_valid = xml.campaignFinanceTransactions();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

    it('confirms failure of campaign-finance-transactions schema: amount missing', async () => {
      const contribution = await newContributionAsync(campaign, government);
      delete contribution.amount;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = campaignFinanceTransactionsSchema;
      const xml_valid = xml.campaignFinanceTransactions();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

    it('confirms failure of campaign-finance-transactions schema: state missing', async () => {
      const contribution = await newContributionAsync(campaign, government);
      delete contribution.state;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = campaignFinanceTransactionsSchema;
      const xml_valid = xml.campaignFinanceTransactions();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('transaction schema', () => {

    it('confirms passing transactions schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = transactionSchema;
      const xml_valid = xml.transaction();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transactions schema: type missing', async () => {
      const contribution = await newContributionAsync(campaign, government);
      delete contribution.type;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = transactionSchema;
      const xml_valid = xml.transaction();
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe('ENUM: transaction purpose schema', () => {
    // Not testing enums: E, H, I, R, X, Y, or Zs
    it('confirms passing transaction purpose schema: A', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.PREP_AD;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: B', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.BROADCAST;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: C', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.PETITION;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: F', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.FUNDRAISING;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: G', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.GENERAL_OPERATING;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: L', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.PRIMTING;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: M', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.MANAGEMENT;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: N', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.NEWSPAPER;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: O', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.OTHER_AD;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: P', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.POSTAGE;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: S', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.POLLING;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: T', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.TRAVEL;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: U', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.UTILITIES;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing transaction purpose schema: W', async () => {
      const contribution = await newContributionAsync(campaign, government);
      contribution.inKindType = InKindDescriptionType.WAGES;
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction purpose schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

  describe.only('transaction description schema', () => {

    it('confirms passing transaction description schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = transactionDescriptionSchema;
      const xml_valid = xml.transactionDescription();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction description schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = transactionDescriptionSchema;
      const xml_valid = xml.transactionDescription();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  it('confirms passing transaction aggregate amount schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = aggregateAmountSchema;
    const xml_valid = xml.aggregateAmount();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction payment method schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = paymentMethodSchema;
    const xml_valid = xml.paymentMethod();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction date schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = dateSchema;
    const xml_valid = xml.transactionDate();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction check number schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    contribution.checkNumber = '329283';
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = checkNoSchema;
    const xml_valid = xml.checkNo();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction interest rate schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = interestRateSchema;
    const xml_valid = xml.interestRate();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction payment schedule schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = paymentScheduleSchema;
    const xml_valid = xml.paymentSchedule();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction occupation letter date schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = occupationLetterDateSchema;
    const xml_valid = xml.occupationLetterDate();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing transaction notes schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    contribution.notes = 'notes on the transaction';
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = transactionNotesSchema;
    const xml_valid = xml.transactionNotes();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });



  it('confirms passing contact schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactSchema;
    const xml_valid = xml.contact();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact id schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactIdSchema;
    const xml_valid = xml.contactId();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact type schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactTypeSchema;
    const xml_valid = xml.contactType();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact occupation schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactOccupationSchema;
    const xml_valid = xml.contactOccupation();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact name schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactNameSchema;
    const xml_valid = xml.contactName();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact business name schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactBusinessNameSchema;
    const xml_valid = xml.businessName();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact name committee schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = contactNameCommitteeSchema;
    const xml_valid = xml.committee();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing cosigner schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution, 1);
    const xsd = cosignerSchema;
    const xml_valid = xml.cosigner();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  describe('Confirms various employment schemas', () => {

    it('confirms passing employment schema', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = employmentSchema;
      const xml_valid = xml.employment();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing not-employed schema', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = employmentSchema;
      const xml_valid = `<employment><not-employed></not-employed></employment>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing self-employed schema', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = employmentSchema;
      const xml_valid = `<employment><self-employed></self-employed></employment>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  describe('confirms passing expend-for options', () => {

    it('confirms passing expend-for with committee-id not committee-name & expend-ind: K', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = expendForSchema;
      const xml_valid = `<expend-for>
        <committee-id>564654</committee-id>
        <committee-type>C</committee-type>
        <amount>396.02</amount>
        <expend-ind>K</expend-ind>
      </expend-for>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing expend-for with committee-name not committee-id & expend-ind: I', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = expendForSchema;
      const xml_valid = `<expend-for>
        <committee-name>Committee Name</committee-name>
        <committee-type>C</committee-type>
        <amount>396.02</amount>
        <expend-ind>I</expend-ind>
      </expend-for>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing expend-for with committee-name & support-ind: Y', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = expendForSchema;
      const xml_valid = `<expend-for>
        <committee-name>Committee Name</committee-name>
        <committee-type>C</committee-type>
        <amount>396.02</amount>
        <expend-ind>I</expend-ind>
      <support-ind>Y</support-ind>
      </expend-for>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing expend-for with committee-name & support-ind: N', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = expendForSchema;
      const xml_valid = `<expend-for>
        <committee-name>Committee Name</committee-name>
        <committee-type>C</committee-type>
        <amount>396.02</amount>
        <expend-ind>I</expend-ind>
      <support-ind>N</support-ind>
      </expend-for>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  describe('confirms passing individual-name options', () => {

    it('confirms passing individual-name', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = individualNameSchema;
      const xml_valid = xml.individualName();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing individual-name w/ prefix, title, suffix, & title', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = individualNameSchema;
      const xml_valid = `<individual-name>
      <prefix>Mrs</prefix>
      <first>Sisi</first>
      <middle>Lex</middle>
      <last>McDonald</last>
      <suffix>Jr</suffix>
      <title>Si</title>
      </individual-name>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  describe('confirms passing phone options', () => {

    it('confirms passing phone: work', async () => {
      const contribution = await newContributionAsync(campaign, government);
      const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = xml.phone();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing phone: work', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
      <work>555-55555-5555</work>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing phone: work & ext', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
        <work>555-55555-5555</work>
        <work-extension>3223</work-extension>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing phone: work & ext & fax', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
        <work>555-55555-5555</work>
        <work-extension>3223</work-extension>
        <fax>555-555-5555</fax>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing phone: home', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
        <home>555-55555-5555</home>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing phone: home & fax', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
        <home>555-55555-5555</home>
        <fax>555-555-5555</fax>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failing phone: home & fax, work-extension causes failure', async () => {
      // const contribution = await newContributionAsync(campaign, government);
      // const xml = new OrestarContributionConverter(contribution, 1);
      const xsd = phoneSchema;
      const xml_valid = `<phone>
        <home>555-55555-5555</home>
        <work-extension>3223</work-extension>
        <fax>555-555-5555</fax>
      </phone>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      // console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

});