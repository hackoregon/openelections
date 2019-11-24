import { expect } from 'chai';
import * as libxml from 'libxmljs';
import {
  newCampaignAsync,
  newContributionAsync,
  newGovernmentAsync,
  truncateAll,
  newExpenditureAsync
} from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import OrestarExpenditureConverter from '../../models/converters/orestarExpenditureConverter';
import { expendForSchema, addressSchema, street1Schema, street2Schema, citySchema, stateSchema, zipSchema, zipPlusFourSchema, transactionSchema, operationSchema, transactionTypeSchema, transactionSubTypeSchema, tranPurposeSchema, agentIdSchema, expendIdSchema, transactionDescriptionSchema, aggregateAmountSchema } from '../schemas/schemas';
import { ExpenditureType, ExpenditureSubType, PurposeType } from '../../models/entity/Expenditure';

let government: Government;
let campaign: Campaign;

describe('Orestar expenditure converter', () => {

  beforeEach(async () => {
    government = await newGovernmentAsync();
    campaign = await newCampaignAsync(government);
  });

  afterEach(async () => {
    await truncateAll();
  });

  describe('address schema', () => {

    it('confirms passing of address schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = addressSchema;
      const xml_valid = xml.address();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of address schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      delete expenditure.address1;
      delete expenditure.city;
      delete expenditure.state;
      delete expenditure.zip;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = addressSchema;
      const xml_valid = xml.address();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('street1 schema', () => {

    it('confirms passing of street1 schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = street1Schema;
      const xml_valid = xml.street1();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of street1 schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.address1 = 'this is more than 40 characters. so the street will fail';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = street1Schema;
      const xml_valid = xml.street1();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('street2 schema', () => {

    it('confirms passing of street2 schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = street2Schema;
      const xml_valid = xml.street2();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of street2 schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.address2 = 'this is more than 40 characters. so the street will fail';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = street2Schema;
      const xml_valid = xml.street2();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('city schema', () => {

    it('confirms passing of city schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = citySchema;
      const xml_valid = xml.city();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of city schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.city = 'For some reason this has a max length of 100 characters, but street1 is only 40? I need 20 more characters.';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = citySchema;
      const xml_valid = xml.city();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('state schema', () => {

    it('confirms passing of state schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = stateSchema;
      const xml_valid = xml.state();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of state schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.state = '3ch';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = stateSchema;
      const xml_valid = xml.state();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('zip schema', () => {

    it('confirms passing of zip schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = zipSchema;
      const xml_valid = xml.zip();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of zip schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.zip = '3ch';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = zipSchema;
      const xml_valid = xml.zip();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('zipPlusFour schema', () => {

    it('confirms passing of zipPlusFour schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.zip = '55555-5555';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = zipPlusFourSchema;
      const xml_valid = xml.zipPlusFour();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of zipPlusFour schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.zip = '9999-999999';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = zipPlusFourSchema;
      const xml_valid = xml.zipPlusFour();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  // describe('transaction schema', () => {

    // it('confirms passing of transaction schema', async () => {
    //   const expenditure = await newExpenditureAsync(campaign, government);
    //   const xml = new OrestarExpenditureConverter(expenditure);
    //   const xsd = transactionSchema;
    //   const xml_valid = xml.transaction();
    //   const xsdDoc = libxml.parseXml(xsd);
    //   const xmlDocValid = libxml.parseXml(xml_valid);
    //   xmlDocValid.validate(xsdDoc);
    //   console.log(xmlDocValid.validationErrors);
    //   expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    // });

  // });

  describe('CHOICE: operation schema', () => {

    it('confirms passing of transaction schema: add', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = operationSchema;
      const xml_valid = xml.operation();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    // This additional choices are not yet supported
    it('confirms passing of transaction schema: amend', () => {
      const xsd = operationSchema;
      const xml_valid = '<operation><amend>true</amend></operation>';
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction schema: delete', async () => {
      const xsd = operationSchema;
      const xml_valid = '<operation><delete>true</delete></operation>';
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction schema', async () => {
      const xsd = operationSchema;
      const xml_valid = '<operation><nope>true</nope></operation>';
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('ENUM: transaction type schema', () => {

    it('confirms passing of transaction type schema: EXPENDITURE', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.type = ExpenditureType.EXPENDITURE;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionTypeSchema;
      const xml_valid = xml.transactionType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction type schema: OTHER', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.type = ExpenditureType.OTHER;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionTypeSchema;
      const xml_valid = xml.transactionType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction type schema: OTHER_DISBURSEMENT', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.type = ExpenditureType.OTHER_DISBURSEMENT;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionTypeSchema;
      const xml_valid = xml.transactionType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction type schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      (expenditure as any).type = 'nope';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionTypeSchema;
      const xml_valid = xml.transactionType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('ENUM: transaction sub type schema', () => {

    it('confirms passing of transaction sub type schema: ACCOUNTS_PAYABLE', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.ACCOUNTS_PAYABLE;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: ACCOUNTS_PAYABLE_RESCINDED', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.ACCOUNTS_PAYABLE_RESCINDED;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: CASH_BALANCE_ADJUSTMENT', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.CASH_BALANCE_ADJUSTMENT;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: CASH_EXPENDITURE', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.CASH_EXPENDITURE;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: MISCELLANEOUS_OTHER_DISBURSEMENT', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: PERSONAL_EXPENDITURE', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.PERSONAL_EXPENDITURE;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction sub type schema: REFUND_OF_CONTRIBUTION', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.subType = ExpenditureSubType.REFUND_OF_CONTRIBUTION;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction sub type schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      (expenditure as any).subType = 'Nope';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionSubTypeSchema;
      const xml_valid = xml.transactionSubType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('ENUM: transaction purpose schema', () => {

    it('confirms passing of transaction purpose schema: BROADCAST', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.BROADCAST;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: CASH', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.CASH;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: FUNDRAISING', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.FUNDRAISING;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: GENERAL_OPERATING', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.GENERAL_OPERATING;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: MANAGEMENT', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.MANAGEMENT;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: NEWSPAPER', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.NEWSPAPER;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: OTHER_AD', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.OTHER_AD;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: PETITION', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.PETITION;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: POLLING', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.POLLING;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: POSTAGE', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.POSTAGE;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: PREP_AD', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.PREP_AD;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: PRIMTING (printing 🙄)', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.PRIMTING;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: REIMBURSEMENT', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.REIMBURSEMENT;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: TRAVEL', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.TRAVEL;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: UTILITIES', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.UTILITIES;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms passing of transaction purpose schema: WAGES', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.purpose = PurposeType.WAGES;
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction purpose schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      (expenditure as any).purpose = 'Nope';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = tranPurposeSchema;
      const xml_valid = xml.tranPurposeType();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('transaction agent-id schema', () => {

    it('confirms passing of transaction action id', async () => {
      const xsd = agentIdSchema;
      const xml_valid = `<agent-id>789</agent-id>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction action id', async () => {
      const xsd = agentIdSchema;
      const xml_valid = `<agent-id>NOPE cuz this is over 30 characters</agent-id>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('transaction expend-id schema', () => {

    it('confirms passing of transaction action id', async () => {
      const xsd = expendIdSchema;
      const xml_valid = `<expend-id>789</expend-id>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction action id', async () => {
      const xsd = expendIdSchema;
      const xml_valid = `<expend-id>NOPE cuz this is over 30 characters</expend-id>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('transaction description schema', () => {

    it('confirms passing of transaction description', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      expenditure.notes = 'Good notes';
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = transactionDescriptionSchema;
      const xml_valid = xml.transactionDescription();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

  });

  describe('transaction aggregate amount', () => {

    it('confirms passing of transaction aggregate amount', async () => {
      const xsd = aggregateAmountSchema;
      const xml_valid = `<aggregate-amount>0.7</aggregate-amount>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of transaction aggregate amount', async () => {
      const xsd = aggregateAmountSchema;
      const xml_valid = `<aggregate-amount>NOPE</aggregate-amount>`;
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(false);
    });

  });

  describe('expend-for schema', () => {

    it('confirms passing of expend-for schema', async () => {
      const expenditure = await newExpenditureAsync(campaign, government);
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = expendForSchema;
      const xml_valid = xml.expendFor();
      const xsdDoc = libxml.parseXml(xsd);
      const xmlDocValid = libxml.parseXml(xml_valid);
      xmlDocValid.validate(xsdDoc);
      console.log(xmlDocValid.validationErrors);
      expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
    });

    it('confirms failure of expend-for schema', async () => {
      const xsd = expendForSchema;
      const xml_valid = 'nope';
      libxml.parseXml(xsd);
      expect(libxml.parseXml.bind(xml_valid)).to.throw();
    });

  });

});