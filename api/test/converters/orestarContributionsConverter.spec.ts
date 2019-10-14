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
  contactSchema
} from '../schemas/schemas';
import {newCampaignAsync, newContributionAsync, newGovernmentAsync, truncateAll} from '../factories';
import {Government} from '../../models/entity/Government';
import {Campaign} from '../../models/entity/Campaign';
import OrestarContributionConverter from '../../models/converters/orestarContributionConverter';

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

  it('confirms passing street1 schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = street1Schema;
    const xml_valid = xml.street1();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc)
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing street2 schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = street2Schema;
    const xml_valid = xml.street2();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc)
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing city schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = citySchema;
    const xml_valid = xml.city();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing state schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = stateSchema;
    const xml_valid = xml.state();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc)
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing zip schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = zipSchema;
    const xml_valid = xml.zip();
    // console.log(xsd, xml_valid);
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing zip plus four schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = zipPlusFourSchema;
    const xml_valid = xml.zipPlusFour();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing foreign post code schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = fgnPostCodeSchema;
    const xml_valid = xml.fgnPostCode();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing country code schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = countryCodeSchema;
    const xml_valid = xml.countryCode();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing county schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = countySchema;
    const xml_valid = xml.county();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing amount schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = amountSchema;
    const xml_valid = xml.amount();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated-tran schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedTranSchema;
    const xml_valid = xml.associatedTran();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated id schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedIdSchema;
    const xml_valid = xml.associatedId();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated complete? schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedCompleteSchema;
    const xml_valid = xml.associatedComplete();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it.only('confirms passing campaign-finance-transactions schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = campaignFinanceTransactionsSchema;
    const xml_valid = xml.campaignFinanceTransactions();
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  // it.only('confirms passing campaign-finance-transactions schema', async () => {
  //   const contribution = await newContributionAsync(campaign, government);
  //   const xml = new OrestarContributionConverter(contribution);
  //   const xsd = contactSchema;
  //   const xml_valid = xml.contact();
  //   var xsdDoc = libxml.parseXml(xsd);
  //   var xmlDocValid = libxml.parseXml(xml_valid);
  //   xmlDocValid.validate(xsdDoc);
  //   console.log(xmlDocValid.validationErrors);
  //   expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  // });

});