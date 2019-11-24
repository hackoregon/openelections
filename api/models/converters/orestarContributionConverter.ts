import {
  Contribution,
  ContributorType,
  ContributionType,
  ContributionSubType,
  PhoneType,
  InKindDescriptionType,
  PaymentMethod
} from '../entity/Contribution';
import { PurposeType } from '../entity/Expenditure';
// import {ContributionSubType} from '../../models/entity/Contribution'

export enum ContributorContactType {
  BUSINESS = 'B',
  POLITICAL_COMMITTEE = 'C',
  FAMILY = 'F',
  INDIVIDUAL = 'I',
  LABOR = 'L',
  OTHER = 'O',
  POLITICAL_PARTY = 'P',
  UNREGISTERED = 'U',
}

export enum TransactionType {
  CONTRIBUTION = 'C',
  OTHER = 'OR'
}

export enum EmploymentType {
  SELF_EMPLOYED = 'self-employed',
  NOT_EMPLOYED = 'not-employed',
  EMPLOYER_NAME = 'employer-name'
}

export enum TransactionSubType {
  CASH = 'CA',
  INKIND_CONTRIBUTION = 'IK',
  // INKIND_PAID_SUPERVISION = 'inkind_paid_supervision',
  INKIND_FORGIVEN_ACCOUNT = 'IKA',
  INKIND_FORGIVEN_PERSONAL = 'IKP',
  ITEM_SOLD_FAIR_MARKET = 'FM',
  ITEM_RETURNED_CHECK = 'LC',
  ITEM_MISC = 'OM',
  ITEM_REFUND = 'RF'
}

export enum InKindTranPurposeType {
  PREP_AD = 'A',
  BROADCAST = 'B',
  PETITION = 'C',
  FUNDRAISING = 'F',
  GENERAL_OPERATING = 'G',
  PRIMTING = 'L', // Not P, "literature, Brochures, Printing"
  MANAGEMENT = 'M',
  NEWSPAPER = 'N',
  OTHER_AD = 'O',
  POSTAGE = 'P',
  POLLING = 'S',
  TRAVEL = 'T',
  UTILITIES = 'U',
  WAGES = 'W'
}

export enum PaymentMethodType {
  CASH = 'CA',
  CHECK = 'CHK',
  MONEY_ORDER = 'CHK',
  CREDIT_CARD_ONLINE = 'CC',
  CREDIT_CARD_PAPER = 'CC',
  ETF = 'EFT'
}

export default class OrestarContributionConverter {

  private contribution: Contribution;
  private orestarFilerId: number;
  private orestarContactId: string;

  constructor(contribution: Contribution, orestarFilerId?: number, orestarContactId?: string) {
    console.log({contribution});
    this.contribution = contribution;
    this.orestarFilerId = orestarFilerId || 1;
    // TODO: orestarContactId may need to be more predictable
    this.orestarContactId = orestarContactId || `oae-contact-${Math.floor(Math.random() * 20000)}`;
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
    } else {
      return '';
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
      return `<county>${this.contribution.county}</county>`;
    } else {
      return '';
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

    return `<campaign-finance-transactions filer-id="${this.orestarFilerId}">
    ${this.contact()}
    ${this.transaction()}
    </campaign-finance-transactions>`;
  }

  public contact() {
    return `<contact id="${this.orestarContactId}">
    ${this.contactType()}
    ${this.contactName()}
    ${this.address()}
    ${this.phone()}
    ${this.contactEmail()}
    ${this.contactOccupation()}
    ${this.employment()}
    </contact>`;
  }

  public contactId() {
    return `<contact id="${this.orestarContactId}"/>`;
  }

  public contactType() {
    if (this.contribution.contributorType) {
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
    } else {
      return '';
    }
  }

  public contactEmail () {
    if (this.contribution.email) {
      return `<email>${this.contribution.email}</email>`;
    } else {
      return '';
    }
  }

  public contactOccupation() {
    return `<occupation>${this.contribution.occupation}</occupation>`;
  }

  private employmentType(): EmploymentType | '' {
    if (!this.contribution.occupation) {
      return '';
    } else if ((this.contribution.occupation || '').toLowerCase() === 'self employed') {
      return EmploymentType.SELF_EMPLOYED;
    } else if ((this.contribution.occupation || '').toLowerCase() === 'not employed') {
      return EmploymentType.NOT_EMPLOYED;
    } else {
      return EmploymentType.EMPLOYER_NAME;
    }
  }

  /**
   * employment
   * This method should return one of the following:
   * 1) <not-employed></not-employed>
   * 2) <self-employed></self-employed>
   * or 3) an <employer-name> with city and state inside
   */
  public employment() {
    if (this.employmentType() === EmploymentType.EMPLOYER_NAME) {
      return `<employment>
        <employer-name>${this.contribution.employerName}</employer-name>
        <city>${this.contribution.employerCity}</city>
        <state>${this.contribution.employerState || 'OR'}</state>
      </employment>`;
    } else {
      if (this.employmentType() !== '') {
        return `<employment><${this.employmentType()}></${this.employmentType()}></employment>`;
      } else {
        return '';
      }
    }
  }

  /**
   * contactName
   * This method should return one of the following:
   * individual-name
   * business-name
   * committee with id or name included
   */
  public contactName() {
    if (this.contribution.contributorType) {
      if (this.contribution.contributorType !== ContributorType.INDIVIDUAL && this.contribution.contributorType !== ContributorType.FAMILY) {
        if (this.contribution.contributorType === ContributorType.POLITICAL_COMMITTEE ||
          this.contribution.contributorType === ContributorType.POLITICAL_PARTY ||
          this.contribution.contributorType === ContributorType.UNREGISTERED) {
            // committee
            return `<contact-name>${this.committee()}</contact-name>`;
        } else {
          //business-name + other
          return `<contact-name>${this.businessName()}</contact-name>`;
        }
      } else {
        return `<contact-name>
          ${this.individualName()}
        </contact-name>`;
      }
    } else {
      return '';
    }
  }

  /**
   * Could return one of the following:
   * <id>6545</id> OR
   * <name>A Political committee</name>
   * But our app only supports name at this time
   */
  public committee() {
    if (this.contribution.name) {
      return `<committee>
      <name>${this.contribution.name}</name>
      </committee>`;
    } else {
      return '';
    }
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

  public businessName() {
    if (this.contribution.name) {
      return `<business-name>${this.contribution.name}</business-name>`;
    } else {
      return '';
    }
  }

  public transaction() {
    return `<transaction id="${this.transactionId()}">
      ${this.operation()}
      <contact-id>${this.orestarContactId}</contact-id>
      ${this.transactionType()}
      ${this.transactionSubType()}
      ${this.amount()}
      ${this.transactionDate()}
    </transaction>`;
  }

  private transactionId() {
    const initialTransactionName = `trans-`;
    const trimmedTransactionName = initialTransactionName.substring(0, 30);
    return trimmedTransactionName;
  }

  public operation() {
    return `<operation>
    <add>true</add>
    </operation>`;
  }

  public transactionType() {
    if (this.contribution.type) {
      let type: TransactionType;
      if (this.contribution.type === ContributionType.CONTRIBUTION) {
        type = TransactionType.CONTRIBUTION;
      } else if (this.contribution.type === ContributionType.OTHER) {
        type = TransactionType.OTHER;
      }
      return `<type>${type}</type>`;
    } else {
      return '';
    }
  }

  public transactionSubType() {
    let subType: TransactionSubType;
    if (this.contribution.subType === ContributionSubType.CASH) {
      subType = TransactionSubType.CASH;
    } else if (this.contribution.subType === ContributionSubType.INKIND_CONTRIBUTION) {
      subType = TransactionSubType.INKIND_CONTRIBUTION;
    } else if (this.contribution.subType === ContributionSubType.INKIND_FORGIVEN_ACCOUNT) {
      subType = TransactionSubType.INKIND_FORGIVEN_ACCOUNT;
    } else if (this.contribution.subType === ContributionSubType.INKIND_FORGIVEN_PERSONAL) {
      subType = TransactionSubType.INKIND_FORGIVEN_PERSONAL;
    } else if (this.contribution.subType === ContributionSubType.ITEM_MISC) {
      subType = TransactionSubType.ITEM_MISC;
    } else if (this.contribution.subType === ContributionSubType.ITEM_REFUND) {
      subType = TransactionSubType.ITEM_REFUND;
    } else if (this.contribution.subType === ContributionSubType.ITEM_RETURNED_CHECK) {
      subType = TransactionSubType.ITEM_RETURNED_CHECK;
    } else if (this.contribution.subType === ContributionSubType.INKIND_PAID_SUPERVISION) {
      // There does not appear to be documentation on what Orestar expects this to be.
      // setting to: inkind contribution
      subType = TransactionSubType.INKIND_CONTRIBUTION;
    }
    console.log('sub types is:', subType);
    return `<sub-type>${subType}</sub-type>`;
  }

  public transactionDate() {
    const date = new Date(this.contribution.date);
    const year = date.getFullYear();
    const mth = date.getMonth() + 1;
    const dt = date.getDate();
    let day: string;
    let month: string;
    if (dt < 10) {
      day = '0' + dt;
    }
    if (mth < 10) {
      month = '0' + mth;
    }
    const newDate = `${year}-${month || mth}-${day || dt}`;
    console.log(this.contribution.date, newDate);
    return `<date>${newDate}</date>`;
  }

  public cosigner() {
    return `<cosigner>
    <contact-id>${this.orestarContactId}</contact-id>
    ${this.amount()}
    </cosigner>`;
  }

  public phone() {
    // we don't need to worry about work-extension. Not collecting that data
    if ((this.contribution.phoneType || '').toLowerCase() === PhoneType.HOME || (this.contribution.phoneType || '').toLowerCase() === PhoneType.MOBILE) {
      return `<phone>
        <home>${this.contribution.phone}</home>
      </phone>`;
    } else if ((this.contribution.phoneType || '').toLowerCase() === PhoneType.WORK) {
      return `<phone>
      <work>${this.contribution.phone}</work>
      </phone>`;
    } else {
      return `<phone>
      <home>555-55555-5555</home>
      </phone>`;
    }
  }

  /**
   * tranPurposeType
   * A tran-purpose is only needed if an In-Kind Contribution subtype is defined
   * Source: page 35 of  https://sos.oregon.gov/elections/Documents/orestarTransFiling.pdf
   */
  public tranPurposeType() {
    let purpose: InKindTranPurposeType;
    if (this.contribution.inKindType) {
      if (this.contribution.inKindType === InKindDescriptionType.BROADCAST) {
        purpose = InKindTranPurposeType.BROADCAST;
      } else if (this.contribution.inKindType === InKindDescriptionType.FUNDRAISING) {
        purpose = InKindTranPurposeType.FUNDRAISING;
      } else if (this.contribution.inKindType === InKindDescriptionType.GENERAL_OPERATING) {
        purpose = InKindTranPurposeType.GENERAL_OPERATING;
      } else if (this.contribution.inKindType === InKindDescriptionType.MANAGEMENT) {
        purpose = InKindTranPurposeType.MANAGEMENT;
      } else if (this.contribution.inKindType === InKindDescriptionType.NEWSPAPER) {
        purpose = InKindTranPurposeType.NEWSPAPER;
      } else if (this.contribution.inKindType === InKindDescriptionType.OTHER_AD) {
        purpose = InKindTranPurposeType.OTHER_AD;
      } else if (this.contribution.inKindType === InKindDescriptionType.PETITION) {
        purpose = InKindTranPurposeType.PETITION;
      } else if (this.contribution.inKindType === InKindDescriptionType.POLLING) {
        purpose = InKindTranPurposeType.POLLING;
      } else if (this.contribution.inKindType === InKindDescriptionType.POSTAGE) {
        purpose = InKindTranPurposeType.POSTAGE;
      } else if (this.contribution.inKindType === InKindDescriptionType.PREP_AD) {
        purpose = InKindTranPurposeType.PREP_AD;
      } else if (this.contribution.inKindType === InKindDescriptionType.PRIMTING) {
        purpose = InKindTranPurposeType.PRIMTING;
      } else if (this.contribution.inKindType === InKindDescriptionType.TRAVEL) {
        purpose = InKindTranPurposeType.TRAVEL;
      } else if (this.contribution.inKindType === InKindDescriptionType.UTILITIES) {
        purpose = InKindTranPurposeType.UTILITIES;
      } else if (this.contribution.inKindType === InKindDescriptionType.WAGES) {
        purpose = InKindTranPurposeType.WAGES;
      }
      return `<tran-purpose>${purpose}</tran-purpose>`;
    } else {
      return '';
    }
  }

  public transactionDescription () {
    // TODO: is this needed?
    return `<description>words here</description>`;
  }

  public aggregateAmount () {
    // TODO: is this needed?
    return `<aggregate-amount>8.5</aggregate-amount>`;
  }

  public paymentMethod () {
    let paymentMethod: string;
    if (this.contribution.paymentMethod) {
      if (this.contribution.paymentMethod === PaymentMethod.CASH) {
        paymentMethod = PaymentMethodType.CASH;
      } else if (this.contribution.paymentMethod === PaymentMethod.CHECK || this.contribution.paymentMethod === PaymentMethod.MONEY_ORDER) {
        paymentMethod = PaymentMethodType.CHECK;
      } else if (this.contribution.paymentMethod === PaymentMethod.CREDIT_CARD_ONLINE ||
        this.contribution.paymentMethod === PaymentMethod.CREDIT_CARD_PAPER) {
        paymentMethod = PaymentMethodType.CREDIT_CARD_ONLINE;
      } else if (this.contribution.paymentMethod === PaymentMethod.ETF) {
        paymentMethod = PaymentMethodType.ETF;
      }
      return `<payment-method>${paymentMethod}</payment-method>`;
    } else {
      return '';
    }
  }

  public checkNo() {
    if (this.contribution.checkNumber) {
      return `<check-no>${this.contribution.checkNumber}</check-no>`;
    } else {
      return ``;
    }
  }

  public interestRate () {
    // TODO: is this needed?
    return '<interest-rate>15%</interest-rate>';
  }

  public paymentSchedule () {
    // TODO: is this needed?
    return `<payment-schedule>payment yay!</payment-schedule>`;
  }

  public occupationLetterDate () {
    // TODO: is this needed?
    return `<occupation-letter-date>2019-01-01</occupation-letter-date>`;
  }

  public transactionNotes () {
    if (this.contribution.notes) {
      return `<notes>${this.contribution.notes}</notes>`;
    } else {
      return '';
    }
  }

}
