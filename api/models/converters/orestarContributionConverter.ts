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

  public zip() {
    return '<zip>98901</zip>';
  }

  public state() {
    return `<state>OR</state>`;
  }

}
