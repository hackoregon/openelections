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
  contactBusinessNameSchema
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
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing street2 schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = street2Schema;
    // const xml_valid = xml.street2();
    const xml_valid = `<street2>Apt. 316</street2>`;
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing city schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = citySchema;
    const xml_valid = xml.city();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing state schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = stateSchema;
    const xml_valid = xml.state();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing zip schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = zipSchema;
    const xml_valid = xml.zip();
    // console.log(xsd, xml_valid);
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing zip plus four schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = zipPlusFourSchema;
    const xml_valid = '<zip-plus4>4565</zip-plus4>';
    // const xml_valid = xml.zipPlusFour();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing foreign post code schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = fgnPostCodeSchema;
    // const xml_valid = xml.fgnPostCode();
    const xml_valid = '<fgn-post-code>06570 ST PAUL</fgn-post-code>'
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing country code schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = countryCodeSchema;
    const xml_valid = '<country-code>+45</country-code>';
    // const xml_valid = xml.countryCode();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing county schema', async () => {
    // const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = countySchema;
    // const xml_valid = xml.county();
    const xml_valid = '<county>Washington</county>';
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing amount schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = amountSchema;
    const xml_valid = xml.amount();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated-tran schema', async () => {
    // const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedTranSchema;
    // const xml_valid = xml.associatedTran();
    const xml_valid = '<associated-tran><id>k89iuo</id><complete>Y</complete></associated-tran>';
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated id schema', async () => {
    // const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedIdSchema;
    // const xml_valid = xml.associatedId();
    const xml_valid = '<id>89ouih4knje</id>';
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing associated complete? schema', async () => {
    // const contribution = await newContributionAsync(campaign, government);
    // const xml = new OrestarContributionConverter(contribution);
    const xsd = associatedCompleteSchema;
    // const xml_valid = xml.associatedComplete();
    const xml_valid = '<complete>N</complete>';
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it.only('confirms passing campaign-finance-transactions schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = campaignFinanceTransactionsSchema;
    const xml_valid = xml.campaignFinanceTransactions();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
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
    const xml = new OrestarContributionConverter(contribution);
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
    const xml = new OrestarContributionConverter(contribution);
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
    const xml = new OrestarContributionConverter(contribution);
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
    const xml = new OrestarContributionConverter(contribution);
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
    const xml = new OrestarContributionConverter(contribution);
    const xsd = contactBusinessNameSchema;
    const xml_valid = xml.businessName();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

  it('confirms passing contact name schema', async () => {
    const contribution = await newContributionAsync(campaign, government);
    const xml = new OrestarContributionConverter(contribution);
    const xsd = contactBusinessNameSchema;
    const xml_valid = xml.businessName();
    const xsdDoc = libxml.parseXml(xsd);
    const xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc);
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });

});