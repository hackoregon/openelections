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
import { expendForSchema, addressSchema, street1Schema, street2Schema, citySchema, stateSchema, zipSchema, zipPlusFourSchema } from '../schemas/schemas';

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
      const xml_valid = xml.address()
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
      const xml_valid = xml.address()
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
      const xml_valid = xml.street1()
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
      const xml_valid = xml.street1()
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
      const xml_valid = xml.street2()
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
      const xml_valid = xml.street2()
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
      const xml_valid = xml.city()
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
      const xml_valid = xml.city()
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
      const xml_valid = xml.state()
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
      const xml_valid = xml.state()
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
      const xml_valid = xml.zip()
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
      const xml_valid = xml.zip()
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
      expenditure.zip = '55555-5555'
      const xml = new OrestarExpenditureConverter(expenditure);
      const xsd = zipPlusFourSchema;
      const xml_valid = xml.zipPlusFour()
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
      const xml_valid = xml.zipPlusFour()
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
      const xml_valid = xml.expendFor()
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