import { Expenditure, PurposeType, PayeeType } from '../entity/Expenditure';


export default class OrestarExpenditureConverter {

  private expenditure: Expenditure;

  constructor(expenditure: Expenditure) {
    this.expenditure = expenditure;
    console.log(this.expenditure);
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
    return `<street1>${this.expenditure.address1}</street1>`;
  }

  public street2() {
    if (this.expenditure.address2) {
      return `<street2>${this.expenditure.address2}</street2>`;
    } else {
      return `<street2/>`;
    }
  }

  public city() {
    return `<city>${this.expenditure.city}</city>`;
  }

  public state() {
    return `<state>${this.expenditure.state}</state>`;
  }

  public zip() {
    return `<zip>${this.expenditure.zip}</zip>`;
  }

  public zipPlusFour() {
    if (this.expenditure.zip.includes('-')) {
      const zipPlus = this.expenditure.zip.split('-')[1];
      return `<zip-plus4>${zipPlus}</zip-plus4>`;
    } else {
      return '';
    }
  }

  /**
   * Civic does not current support this feature
   * Choice of committee-id or committee-name
   * committee-type: C = Committee (default), M = Measure, R = Recall
   * expend-ind can be I (independent) or K (In-Kind)
   * support-ind Y or N. Only required if "I" is selected for expend-ind
   */
  public expendFor() {
    return `<expend-for>
    <committee-name>Sup</committee-name>
      <committee-type>C</committee-type>
      <amount>7</amount>
      <expend-ind>I</expend-ind>
      <support-ind>Y</support-ind>
    </expend-for>`;
  }

}