import {
  Expenditure,
  PurposeType,
  PayeeType,
  ExpenditureType,
  ExpenditureSubType,
  PaymentMethod
} from '../entity/Expenditure';

/**
 * ExpenditurePayeeType
 * Orestar expects one of the following:
 * B, C, F, I, L, O, P, U
 */
export enum ExpenditurePayeeType {
  INDIVIDUAL = 'I',
  BUSINESS = 'B',
  FAMILY = 'F',
  LABOR = 'L',
  POLITICAL_COMMITTEE = 'C',
  POLITICAL_PARTY = 'P',
  UNREGISTERED = 'U',
  OTHER = 'O'
}
/**
 * ExpenditureMainType Enum
 * There are a total 6 options for this:
 * C, E, OR, OD, OA, O
 * Our system only supports 3.
 */
export enum ExpenditureMainType {
  EXPENDITURE = 'E',
  OTHER = 'O',
  OTHER_DISBURSEMENT = 'OD'
}
/**
 * ExpenditureMainSubType
 * There is a total of 31, but we only track 7:
 * CA, IK, IKP, IKA, NLR, PL, PI, PC, ELR, FM, IN, OM, RF, LC, OR, AE, PE, CE, AP, NLP, ELP, NP, RT, UIP, UCP, ULP, NLF, APR, OMD, CBA, PEA
 */
export enum ExpenditureMainSubType {
  ACCOUNTS_PAYABLE = 'AP',
  CASH_EXPENDITURE = 'CE',
  PERSONAL_EXPENDITURE = 'PE',
  ACCOUNTS_PAYABLE_RESCINDED = 'APR',
  CASH_BALANCE_ADJUSTMENT = 'CBA',
  MISCELLANEOUS_OTHER_DISBURSEMENT = 'OMD',
  REFUND_OF_CONTRIBUTION = 'RF'
}

/**
 * PurposeType
 * These are all the tran-purpose types available:
 * A, B, C, E, F, G, H, I, L, M, N, O, P, R, S, T, U, W, X, Y, Z
 */
export enum ExpenditurePurposeType {
  WAGES = 'W',
  CASH = 'C',
  REIMBURSEMENT = 'R',
  BROADCAST = 'B',
  FUNDRAISING = 'F',
  GENERAL_OPERATING = 'G',
  PRIMTING = 'L',
  MANAGEMENT = 'M',
  NEWSPAPER =  'N',
  OTHER_AD = 'O',
  PETITION = 'Y',
  POSTAGE = 'P',
  PREP_AD = 'A',
  POLLING = 'S',
  TRAVEL = 'T',
  UTILITIES = 'U',
}

/**
 * ExpenditurePaymentMethod
 *  CHK, ACH, EFT, DC CC, CA
 * source on page 33-34: https://sos.oregon.gov/elections/Documents/orestarTransFiling.pdf
 */
export enum ExpenditurePaymentMethod {
  CASH = 'CA',
  CHECK = 'CHK',
  MONEY_ORDER = 'CHK',
  CREDIT_CARD_ONLINE = 'CC',
  CREDIT_CARD_PAPER = 'CC',
  ETF = 'EFT',
  DEBIT = 'DC'
}

export type ExpenditureConvertType = {
  contact: string;
  transaction: string;
};

export default class OrestarExpenditureConverter {

  private expenditure: Expenditure;
  private orestarContactId: string;

  constructor(expenditure: Expenditure) {
    this.expenditure = expenditure;

    const initialContactId = `oae-${this.expenditure.zip || ''}-${this.expenditure.name || ''}-${this.expenditure.id}`.replace(/\s+/g, '-').toLowerCase();
    const oaeContactId = initialContactId.substring(0, 30);
    this.orestarContactId = oaeContactId;
  }

  public convert(): ExpenditureConvertType {
    return {
      contact: `${this.contact()}`,
      transaction: `${this.transaction()}`
    };
  }

  public generate() {
    return `${this.contact()}${this.transaction()}`;
  }

  public contact() {
    return `<contact id="${this.orestarContactId}">${this.contactType()}${this.contactName()}${this.address()}</contact>`;
  }

  public contactType() {
    if (this.expenditure.payeeType) {
      let type: ExpenditurePayeeType;
      if (this.expenditure.payeeType === PayeeType.BUSINESS) {
        type = ExpenditurePayeeType.BUSINESS;
      } else if (this.expenditure.payeeType === PayeeType.FAMILY) {
        type = ExpenditurePayeeType.FAMILY;
      } else if (this.expenditure.payeeType === PayeeType.INDIVIDUAL) {
        type = ExpenditurePayeeType.INDIVIDUAL;
      } else if (this.expenditure.payeeType === PayeeType.LABOR) {
        type = ExpenditurePayeeType.LABOR;
      } else if (this.expenditure.payeeType === PayeeType.OTHER) {
        type = ExpenditurePayeeType.OTHER;
      } else if (this.expenditure.payeeType === PayeeType.POLITICAL_COMMITTEE) {
        type = ExpenditurePayeeType.POLITICAL_COMMITTEE;
      } else if (this.expenditure.payeeType === PayeeType.POLITICAL_PARTY) {
        type = ExpenditurePayeeType.POLITICAL_PARTY;
      } else if (this.expenditure.payeeType === PayeeType.UNREGISTERED) {
        type = ExpenditurePayeeType.UNREGISTERED;
      }
      return `<type>${type}</type>`;
    } else {
      return '';
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
    if (this.expenditure.payeeType) {
      if (this.expenditure.payeeType !== PayeeType.INDIVIDUAL && this.expenditure.payeeType !== PayeeType.FAMILY) {
        if (this.expenditure.payeeType === PayeeType.POLITICAL_COMMITTEE ||
          this.expenditure.payeeType === PayeeType.POLITICAL_PARTY ||
          this.expenditure.payeeType === PayeeType.UNREGISTERED) {
            // committee
            return `<contact-name>${this.committee()}</contact-name>`;
        } else {
          //business-name + other
          return `<contact-name>${this.businessName()}</contact-name>`;
        }
      } else {
        return `<contact-name>${this.individualName()}</contact-name>`;
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
    if (this.expenditure.name) {
      return `<committee><name>${this.expenditure.name}</name></committee>`;
    } else {
      return '';
    }
  }

  public individualName() {
    const name = this.expenditure.name.split(' ');
    if (name.length === 2) {
      const fname = name[0];
      const lname = name[1];
      return `<individual-name><first>${fname}</first><last>${lname}</last></individual-name>`;
    } else if (name.length === 1) {
      return `<individual-name><first>${this.expenditure.name}</first></individual-name>`;
    } else if (name.length === 3) {
      const fname = `${name[0]} ${name[1]}`;
      const lname = name[2];
      return `<individual-name><first>${fname}</first><last>${lname}</last></individual-name>`;
    } else if (name.length === 4) {
      const fname = `${name[0]} ${name[1]}`;
      const middle = name[2];
      const lname =  name[3];
      return `<individual-name><first>${fname}</first><middle>${middle}</middle><last>${lname}</last></individual-name>`;
    } else {
      return '';
    }
  }

  public businessName() {
    if (this.expenditure.name) {
      return `<business-name>${this.expenditure.name}</business-name>`;
    } else {
      return '';
    }
  }

  public address() {
    return `<address>${this.street1()}${this.street2()}${this.city()}${this.state()}${this.zip()}</address>`;
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

  public transaction() {
    return `<transaction id="${this.transactionId()}">${this.operation()}<contact-id>${this.orestarContactId}</contact-id>${this.transactionType()}${this.transactionSubType()}${this.tranPurposeType()}${this.transactionDescription()}${this.amount()}${this.paymentMethod()}${this.transactionDate()}${this.checkNo()}</transaction>`;
  }

  private transactionId() {
    const initialTransactionName = `trans-${Date.now() * Math.random()}`;
    const trimmedTransactionName = initialTransactionName.substring(0, 30);
    return trimmedTransactionName;
  }

  public operation() {
    return `<operation><add>true</add></operation>`;
  }

  public transactionType() {
    if (this.expenditure.type) {
      let type: ExpenditureMainType;
      if (this.expenditure.type === ExpenditureType.EXPENDITURE) {
        type = ExpenditureMainType.EXPENDITURE;
      } else if (this.expenditure.type === ExpenditureType.OTHER) {
        type = ExpenditureMainType.OTHER;
      } else if (this.expenditure.type === ExpenditureType.OTHER_DISBURSEMENT) {
        type = ExpenditureMainType.OTHER_DISBURSEMENT;
      }
      return `<type>${type}</type>`;
    } else {
      return '';
    }
  }

  public transactionSubType() {
    if (this.expenditure.subType) {
      let type;
      if (this.expenditure.subType === ExpenditureSubType.ACCOUNTS_PAYABLE) {
        type = ExpenditureMainSubType.ACCOUNTS_PAYABLE;
      } else if (this.expenditure.subType === ExpenditureSubType.ACCOUNTS_PAYABLE_RESCINDED) {
        type = ExpenditureMainSubType.ACCOUNTS_PAYABLE_RESCINDED;
      } else if (this.expenditure.subType === ExpenditureSubType.CASH_BALANCE_ADJUSTMENT) {
        type = ExpenditureMainSubType.CASH_BALANCE_ADJUSTMENT;
      } else if (this.expenditure.subType === ExpenditureSubType.CASH_EXPENDITURE) {
        type = ExpenditureMainSubType.CASH_EXPENDITURE;
      } else if (this.expenditure.subType === ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT) {
        type = ExpenditureMainSubType.MISCELLANEOUS_OTHER_DISBURSEMENT;
      } else if (this.expenditure.subType === ExpenditureSubType.PERSONAL_EXPENDITURE) {
        type = ExpenditureMainSubType.PERSONAL_EXPENDITURE;
      } else if (this.expenditure.subType === ExpenditureSubType.REFUND_OF_CONTRIBUTION) {
        type = ExpenditureMainSubType.REFUND_OF_CONTRIBUTION;
      }
      return `<sub-type>${type}</sub-type>`;
    } else {
      return '';
    }
  }

  public amount() {
    if (this.expenditure.amount) {
      return `<amount>${this.expenditure.amount}</amount>`;
    } else {
      return '';
    }
  }

  public tranPurposeType() {
    let purpose: ExpenditurePurposeType;
    if (this.expenditure.purpose) {
      if (this.expenditure.purpose === PurposeType.BROADCAST) {
        purpose = ExpenditurePurposeType.BROADCAST;
      } else if (this.expenditure.purpose === PurposeType.CASH) {
        purpose = ExpenditurePurposeType.CASH;
      } else if (this.expenditure.purpose === PurposeType.FUNDRAISING) {
        purpose = ExpenditurePurposeType.FUNDRAISING;
      } else if (this.expenditure.purpose === PurposeType.GENERAL_OPERATING) {
        purpose = ExpenditurePurposeType.GENERAL_OPERATING;
      } else if (this.expenditure.purpose === PurposeType.MANAGEMENT) {
        purpose = ExpenditurePurposeType.MANAGEMENT;
      } else if (this.expenditure.purpose === PurposeType.NEWSPAPER) {
        purpose = ExpenditurePurposeType.NEWSPAPER;
      } else if (this.expenditure.purpose === PurposeType.OTHER_AD) {
        purpose = ExpenditurePurposeType.OTHER_AD;
      } else if (this.expenditure.purpose === PurposeType.PETITION) {
        purpose = ExpenditurePurposeType.PETITION;
      } else if (this.expenditure.purpose === PurposeType.POLLING) {
        purpose = ExpenditurePurposeType.POLLING;
      } else if (this.expenditure.purpose === PurposeType.POSTAGE) {
        purpose = ExpenditurePurposeType.POSTAGE;
      } else if (this.expenditure.purpose === PurposeType.PREP_AD) {
        purpose = ExpenditurePurposeType.PREP_AD;
      } else if (this.expenditure.purpose === PurposeType.PRIMTING) {
        purpose = ExpenditurePurposeType.PRIMTING;
      } else if (this.expenditure.purpose === PurposeType.REIMBURSEMENT) {
        purpose = ExpenditurePurposeType.REIMBURSEMENT;
      } else if (this.expenditure.purpose === PurposeType.TRAVEL) {
        purpose = ExpenditurePurposeType.TRAVEL;
      } else if (this.expenditure.purpose === PurposeType.UTILITIES) {
        purpose = ExpenditurePurposeType.UTILITIES;
      } else if (this.expenditure.purpose === PurposeType.WAGES) {
        purpose = ExpenditurePurposeType.WAGES;
      }
      return `<tran-purpose>${purpose}</tran-purpose>`;
    } else {
      return '';
    }
  }

  public transactionDescription() {
    if (this.expenditure.notes) {
      return `<description>${this.expenditure.notes}</description>`;
    } else if (process.env.NODE_ENV !== 'production') {
      return `<description>Test notes and descriptions</description>`;
    } else {
      return '';
    }
  }

  /**
   * paymentMethod
   * Only required for cash expenditure, non-exempt loan payment, or other disbursement transactions.
   */
  public paymentMethod() {
    if (this.expenditure.paymentMethod) {
      if (this.expenditure.subType === ExpenditureSubType.CASH_EXPENDITURE || this.expenditure.subType === ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT) {
        let method: ExpenditurePaymentMethod;
        if (this.expenditure.paymentMethod === PaymentMethod.DEBIT || this.expenditure.paymentMethod === PaymentMethod.CASH) {
          method = ExpenditurePaymentMethod.DEBIT;
        } else if (this.expenditure.paymentMethod === PaymentMethod.CHECK) {
          method = ExpenditurePaymentMethod.CHECK;
        } else if (this.expenditure.paymentMethod === PaymentMethod.CREDIT_CARD_ONLINE) {
          method = ExpenditurePaymentMethod.CREDIT_CARD_ONLINE;
        } else if (this.expenditure.paymentMethod === PaymentMethod.CREDIT_CARD_PAPER) {
          method = ExpenditurePaymentMethod.CREDIT_CARD_PAPER;
        } else if (this.expenditure.paymentMethod === PaymentMethod.ETF) {
          method = ExpenditurePaymentMethod.ETF;
        } else if (this.expenditure.paymentMethod === PaymentMethod.MONEY_ORDER) {
          method = ExpenditurePaymentMethod.MONEY_ORDER;
        }
        return `<payment-method>${method}</payment-method>`;
      }
      return '';
    } else {
      return '';
    }
  }

  public transactionDate() {
    const date = new Date(this.expenditure.date);
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
    return `<date>${newDate}</date>`;
  }

  public checkNo() {
    if (this.expenditure.checkNumber) {
      return `<check-no>${this.expenditure.checkNumber}</check-no>`;
    } else {
      return ``;
    }
  }

  /**
   * aggregateAmount
   * NOT CURRENTLY COLLECTED IN OUR SYSTEM
   */
  public aggregateAmount() {
    return '';
  }

  /**
   * agentId
   * NOT CURRENTLY COLLECTED IN OUR SYSTEM
   */
  public agentId() {
    return '';
  }

  /**
   * expendId
   * NOT CURRENTLY COLLECTED IN OUR SYSTEM
   */
  public expendId() {
    return '';
  }

  /**
   * interestRate
   * NOT CURRENTLY COLLECTED IN OUR SYSTEM
   */
  public interestRate() {
    return '';
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