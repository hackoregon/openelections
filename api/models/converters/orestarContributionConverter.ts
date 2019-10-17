import { Contribution, ContributorType } from '../entity/Contribution';

export enum ContributorContactType {
  INDIVIDUAL = 'I',
  BUSINESS = 'B',
  FAMILY = 'F',
  LABOR = 'L',
  POLITICAL_COMMITTEE = 'C',
  POLITICAL_PARTY = 'P',
  UNREGISTERED = 'U',
  OTHER = 'O'
}

export default class OrestarContributionConverter {

  private contribution: Contribution;
  private orestarFilerId: string;
  private orestarContractId: string;

  constructor(contribution: Contribution) {
    console.log({contribution}, contribution.zip);
    this.contribution = contribution;
    this.orestarContractId = `oae-contact-${Date.now() * Math.floor(Math.random() * 10)}`;
  }

  public generate() {
    return `<?xml version="1.0"?><address>
    <street1>5903 SW Corbett Ave Apt 5</street1>
    <street2/>
    <city>Portland</city>
    <state>OR</state>
    <zip>97239</zip>
    </address>`;
  }

  public address() {
    return `<address>
    ${this.street1()}
    ${this.street2()}
    ${this.city()}
    ${this.state()}
    ${this.zip()}
    </address>`;
  }

  public street1() {
    return `<street1>${this.contribution.address1}</street1>`;
  }

  public street2() {
    if (this.contribution.address2) {
      return `<street2>${this.contribution.address2}</street2>`;
    } else {
      return `<street2/>`;
    }
  }

  public city() {
    return `<city>${this.contribution.city}</city>`;
  }

  public state() {
    return `<state>${this.contribution.state}</state>`;
  }

  public zip() {
    return `<zip>${this.contribution.zip}</zip>`;
  }

  public zipPlusFour() {
    if (this.contribution.zip.includes('-')) {
      const zipPlus = this.contribution.zip.split('-')[1];
      return `<zip-plus4>${zipPlus}</zip-plus4>`;
    }
  }

  public fgnPostCode() {
    return `<fgn-post-code>06570 ST PAUL</fgn-post-code>`;
  }

  public countryCode() {
    return `<country-code>+45</country-code>`;
  }

  public county() {
    if (this.contribution.county) {
      return `<county>${this.contribution.county}</county`;
    }
  }

  public amount() {
    return `<amount>${this.contribution.amount}</amount>`;
  }

  public associatedTran() {
    return `<associated-tran>
      <id>k89iuo</id>
      <complete>Y</complete>
    </associated-tran>`;
  }

  public associatedId() {
    return `<id>89ouih4knje</id>`;
  }

  public associatedComplete() {
    return `<complete>N</complete>`;
  }

  public campaignFinanceTransactions() {

    return `<campaign-finance-transactions filer-id="17697">
    ${this.contact()}
    ${this.transaction()}
    </campaign-finance-transactions>`;
  }

  public contact() {
    return `<contact id="contact-AB84260797">
    ${this.contactType()}
    ${this.contactName()}
    ${this.address()}
    ${this.contactOccupation()}
    ${this.employment()}
    </contact>`;
  }

  public contactId() {
    return `<contact id="${this.orestarContractId}"/>`;
  }

  public contactType() {
    let type: ContributorContactType;
    if (this.contribution.contributorType === ContributorType.INDIVIDUAL) {
      type = ContributorContactType.INDIVIDUAL;
    } else if (this.contribution.contributorType === ContributorType.BUSINESS) {
      type = ContributorContactType.BUSINESS;
    } else if (this.contribution.contributorType === ContributorType.FAMILY) {
      type = ContributorContactType.FAMILY;
    } else if (this.contribution.contributorType === ContributorType.LABOR) {
      type = ContributorContactType.LABOR;
    } else if (this.contribution.contributorType === ContributorType.POLITICAL_COMMITTEE) {
      type = ContributorContactType.POLITICAL_COMMITTEE;
    } else if (this.contribution.contributorType === ContributorType.POLITICAL_PARTY) {
      type = ContributorContactType.POLITICAL_PARTY;
    } else if (this.contribution.contributorType === ContributorType.UNREGISTERED) {
      type = ContributorContactType.UNREGISTERED;
    } else if (this.contribution.contributorType === ContributorType.OTHER) {
      type = ContributorContactType.OTHER;
    }
    return `<type>${type}</type>`;
  }

  public contactOccupation() {
    return `<occupation>${this.contribution.occupation}</occupation>`;
  }

  public contactName() {
    return `<contact-name>
      ${this.individualName()}
    </contact-name>`;
  }

  public individualName() {
    const middleName = this.contribution.middleInitial
      ? `<middle>${this.contribution.middleInitial}</middle>`
      : '';
    return `<individual-name>
    <first>${this.contribution.firstName}</first>
    ${middleName}
    <last>${this.contribution.lastName}</last>
    </individual-name>`;
  }

  public employment() {
    return `<employment>
      <employer-name>${this.contribution.employerName}</employer-name>
      <city>${this.contribution.employerCity}</city>
      <state>${this.contribution.employerState || 'OR'}</state>
    </employment>`;
  }

  public businessName() {
    return `<business-name>Civic Software</business-name>`;
  }

  public transaction() {
    return `<transaction id="trans-AB84260797-170935140">
      ${this.operation()}
      <contact-id>contact-AB84260797</contact-id>
      <type>C</type>
      <sub-type>CA</sub-type>
      <amount>5.00</amount>
      <date>2019-08-09</date>
    </transaction>`;
  }

  public operation() {
    return `<operation>
    <add>true</add>
    </operation>`;
  }

}
