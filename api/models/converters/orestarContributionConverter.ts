import { Contribution } from "../entity/Contribution";

export default class OrestarContributionConverter {

  private contribution: Contribution;

  constructor(contribution: Contribution) {
    this.contribution = contribution;
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

  public address() {}

  public street1() {
    return `<street1>5903 SW Corbett Ave Apt 5</street1>`;
  }

  public street2() {
    return `<street2>Apt. 316</street2>`;
  }

  public city() {
    return `<city>Portland</city>`;
  }

  public state() {
    return `<state>OR</state>`;
  }

  public zip() {
    return '<zip>98901</zip>';
  }

  public zipPlusFour() {
    return '<zip-plus4>9891</zip-plus4>';
  }

  public fgnPostCode() {
    return `<fgn-post-code>06570 ST PAUL</fgn-post-code>`;
  }

  public countryCode() {
    return `<country-code>+45</country-code>`;
  }

  public county() {
    return `<county>Washington</county>`;
  }

  public amount() {
    return `<amount>5.00</amount>`;
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
    <contact id="contact-AB84260797">
      <type>I</type>
      <contact-name>
      <individual-name>
      <first>Mira</first>
      <last>Glasser</last>
      </individual-name>
      </contact-name>
      <address>
      <street1>5903 SW Corbett Ave Apt 5</street1>
      <street2/>
      <city>Portland</city>
      <state>OR</state>
      <zip>97239</zip>
      </address>
      <occupation>Bookseller</occupation>
      <employment>
      <employer-name>Daedalus Books</employer-name>
      <city>Portland</city>
      <state>OR</state>
      </employment>
    </contact>
    <transaction id="trans-AB84260797-170935140">
      <operation>
      <add>true</add>
      </operation>
      <contact-id>contact-AB84260797</contact-id>
      <type>C</type>
      <sub-type>CA</sub-type>
      <amount>5.00</amount>
      <date>2019-08-09</date>
    </transaction>
    </campaign-finance-transactions>`;
  }

  public contact() {
    return `<contact id="contact-AB84260797">
    <type>I</type>
    <contact-name>
    <individual-name>
    <first>Mira</first>
    <last>Glasser</last>
    </individual-name>
    </contact-name>
    <address>
    <street1>5903 SW Corbett Ave Apt 5</street1>
    <street2/>
    <city>Portland</city>
    <state>OR</state>
    <zip>97239</zip>
    </address>
    <occupation>Bookseller</occupation>
    <employment>
    <employer-name>Daedalus Books</employer-name>
    <city>Portland</city>
    <state>OR</state>
    </employment>
    </contact>`;
  }

}
