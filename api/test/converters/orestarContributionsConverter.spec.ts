import {expect} from 'chai';
import {getConnection} from 'typeorm';
import * as libxml from 'libxmljs';
import { addressSchema, zipSchema, stateSchema } from '../schemas/schemas';
import {newCampaignAsync, newContributionAsync, newGovernmentAsync, truncateAll} from '../factories';
import {Government} from '../../models/entity/Government';
import {Campaign} from '../../models/entity/Campaign';
import OrestarContributionConverter from '../../models/converters/orestarContributionConverter';

let repository: any;
let government: Government;
let campaign: Campaign;

describe('orestar contribution converter', () => {

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

  // it('tests', async () => {

  //   const contribution = await newContributionAsync(campaign, government);

  //   const xml = new OrestarContributionConverter(contribution);

  //   const xsd = addressSchema;
  //   const xml_valid = xml.generate();

  //   var xsdDoc = libxml.parseXml(xsd);
  //   var xmlDocValid = libxml.parseXml(xml_valid);
  //   xmlDocValid.validate(xsdDoc)
  //   console.log(xmlDocValid.validationErrors);
  //   expect(xmlDocValid.validate(xsdDoc)).to.equal(true);

  // });

  // it('test', async () => {
  //   const contribution = await newContributionAsync(campaign, government);

  //   const xml = new OrestarContributionConverter(contribution);

  //   const xsd = zipSchema;
  //   const xml_valid = xml.zip();
  //   console.log(xsd, xml_valid);
  //   var xsdDoc = libxml.parseXml(xsd);
  //   var xmlDocValid = libxml.parseXml(xml_valid);
  //   xmlDocValid.validate(xsdDoc)
  //   // console.log(xmlDocValid.validationErrors);
  //   expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  // });

  it('test', async () => {
    const contribution = await newContributionAsync(campaign, government);

    const xml = new OrestarContributionConverter(contribution);

    const xsd = stateSchema;
    const xml_valid = xml.state();
    console.log(xsd, xml_valid);
    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    xmlDocValid.validate(xsdDoc)
    console.log(xmlDocValid.validationErrors);
    expect(xmlDocValid.validate(xsdDoc)).to.equal(true);
  });


});