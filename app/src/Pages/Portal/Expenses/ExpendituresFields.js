import React from 'react';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { format } from 'date-fns';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { stateList } from '../../../components/Forms/Utils/FormsUtils';
import CurrencyField from '../../../components/Fields/CurrencyField';
import DateField from '../../../components/Fields/DateField';
import SelectField from '../../../components/Fields/SelectField';
import TextField from '../../../components/Fields/TextField';
import AddressLookupField from '../../../components/Fields/AddressLookupField';
import {
  ExpenditureTypeEnum,
  ExpenditureSubTypeEnum,
  PayeeTypeEnum,
  PurposeTypeEnum,
  PaymentMethodEnum,
} from '../../../api/api';

export const FormSectionEnum = Object.freeze({
  BASIC: 'basicsSection',
  PAYEE_INFO: 'payeeInfoSection',
});

export const mapExpenditureDataToForm = expenditure => {
  const {
    id,
    buttonSubmitted,
    date,
    updatedAt,
    subType,
    amount,
    expenditureType,
    expenditureSubType,
    paymentMethod,
    checkNumber,
    purposeType,
    payeeType,
    payeeName,
    streetAddress,
    addressLine2,
    city,
    state,
    zipcode,
    notes,
  } = expenditure;
  return {
    id,
    buttonSubmitted: buttonSubmitted || '',
    date: format(new Date(date), 'YYYY-MM-DD'),
    updatedAt: format(new Date(updatedAt), 'MM-DD-YY hh:mm a'),
    subType,
    amount,
    expenditureType,
    expenditureSubType,
    paymentMethod,
    checkNumber: checkNumber || '',
    purposeType,
    payeeType,
    payeeName,
    streetAddress,
    addressLine2,
    city,
    state,
    zipcode,
    notes,
  };
};

export const expendituresEmptyState = {
  // BASICS VALUES
  amount: '',
  date: '',
  expenditureType: '',
  expenditureSubType: '',
  paymentMethod: '',
  checkNumber: '',
  purposeType: '',

  // PAYEE INFO
  payeeType: PayeeTypeEnum.INDIVIDUAL,
  payeeName: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: '',
  zipcode: '',
  notes: '',
};

export const fields = {
  // BASICS SECTION
  amount: {
    label: 'Amount of Expenditure',
    section: FormSectionEnum.BASIC,
    component: CurrencyField,
    validation: Yup.number().required('The expenditure amount is required'),
  },
  date: {
    label: 'Date of Expenditure',
    section: FormSectionEnum.BASIC,
    component: DateField,
    validation: Yup.string().required('An expenditure date is required'),
  },
  expenditureType: {
    label: 'Expenditure Type',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        ExpenditureTypeEnum.EXPENDITURE,
        ExpenditureTypeEnum.OTHER,
        ExpenditureTypeEnum.OTHER_DISBURSEMENT,
      ],
    },
    validation: Yup.string().required('An expenditure type is required'),
  },
  expenditureSubType: {
    label: 'Expenditure SubType',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
        ExpenditureSubTypeEnum.CASH_EXPENDITURE,
        ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
        ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
        ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT,
        ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
        ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION,
      ],
      limitByField: 'expenditureType',
      limitByValues: {
        // If Expenditure Type is “Expenditure,” drop down says: Accounts Payable, Cash Expenditure, Personal Expenditure for Reimbursement.
        expenditure: [
          ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
          ExpenditureSubTypeEnum.CASH_EXPENDITURE,
          ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
        ],
        // If Expenditure Type is “Other.” drop down says: Accounts Payable Rescinded, Cash Balance Adjustment (maybe)
        other: [
          ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
          ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT,
        ],
        other_disbursement: [
          // If Expenditure Type is “Other Disbursement,” drop down says: Miscellaneous Other Disbursement, Return or Refund of Contribution.
          ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
          ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION,
        ],
      },
    },
    validation: Yup.string().required('The Expenditure subtype is required'),
  },
  paymentMethod: {
    label: 'Payment Method',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        PaymentMethodEnum.CASH,
        PaymentMethodEnum.CHECK,
        PaymentMethodEnum.MONEY_ORDER,
        PaymentMethodEnum.CREDIT_CARD_ONLINE,
        PaymentMethodEnum.CREDIT_CARD_PAPER,
      ],
    },
    validation: Yup.string().required('The payment method is required'),
  },
  checkNumber: {
    label: 'Check Number',
    section: FormSectionEnum.BASIC,
    component: TextField,
    validation: Yup.number().required('Check number is required'),
  },
  purposeType: {
    label: 'Purpose of Expenditure',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        PurposeTypeEnum.WAGES,
        PurposeTypeEnum.CASH,
        PurposeTypeEnum.REIMBURSEMENT,
        PurposeTypeEnum.BROADCAST,
        PurposeTypeEnum.FUNDRAISING,
        PurposeTypeEnum.GENERAL_OPERATING,
        PurposeTypeEnum.PRIMTING,
        PurposeTypeEnum.MANAGEMENT,
        PurposeTypeEnum.NEWSPAPER,
        PurposeTypeEnum.OTHER_AD,
        PurposeTypeEnum.PETITION,
        PurposeTypeEnum.POSTAGE,
        PurposeTypeEnum.PREP_AD,
        PurposeTypeEnum.POLLING,
        PurposeTypeEnum.TRAVEL,
        PurposeTypeEnum.UTILITIES,
      ],
    },
    validation: Yup.string().required(
      'A description of the purpose is required'
    ),
    // purposeType IS REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.
  },

  // PAYEE SECTION
  payeeType: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: 'Payee Type',
    section: FormSectionEnum.PAYEE_INFO,
    component: SelectField,
    options: {
      values: [
        PayeeTypeEnum.INDIVIDUAL,
        PayeeTypeEnum.BUSINESS,
        PayeeTypeEnum.FAMILY,
        PayeeTypeEnum.LABOR,
        PayeeTypeEnum.POLITICAL_COMMITTEE,
        PayeeTypeEnum.POLITICAL_PARTY,
        PayeeTypeEnum.UNREGISTERED,
        PayeeTypeEnum.OTHER,
      ],
    },
    validation: Yup.string().required('The payee type is required'),
  },
  payeeName: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Payee's Name",
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string().required("The payee's name is required"),
  },
  streetAddress: {
    label: 'Street Address',
    section: FormSectionEnum.PAYEE_INFO,
    // eslint-disable-next-line react/display-name
    component: props => (
      <AddressLookupField
        {...props.field}
        {...props}
        updateFields={{
          street: 'streetAddress',
          stateShort: 'state',
          city: 'city',
          zipCode: 'zipcode',
        }}
      />
    ),
    validation: Yup.string().required('Your street address is required'),
  },

  addressLine2: {
    label: 'Address Line 2',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    // NO VALIDATION BECAUSE NOT REQUIRED?
  },
  city: {
    label: 'City',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string().required("The payee's city is required"),
  },
  state: {
    label: 'State',
    section: FormSectionEnum.PAYEE_INFO,
    component: SelectField,
    options: { values: stateList },
    alidation: Yup.string().required('Your state is required'),
  },
  zipcode: {
    label: 'Zipcode',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.number().required('A zipcode is required'),
  },
  notes: {
    label: 'Notes',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string(),
  },
};

export const validate = values => {
  const {
    // amount,
    // dateOfExpenditure,
    // expenditureType,
    expenditureSubType,
    paymentMethod,
    checkNumber,
    // purposeType,

    // // PAYEE INFO
    payeeType,
    // payeeName,
    // streetAddress,
    // addressLine2,
    // city,
    // state,
    // zipcode,
    // notes,
  } = values;
  const error = {};
  const visible = {};

  // LOGIC FOR CONDITIONALLY VISIBLE FIELDS OR DROPDOWN SELECT OPTIONS:

  // Make these areas visible
  visible.isPerson = !!(
    payeeType === PayeeTypeEnum.INDIVIDUAL || payeeType === PayeeTypeEnum.FAMILY
  );

  // If PaymentMethod was check, show check number field
  visible.checkSelected = !!(
    paymentMethod === PaymentMethodEnum.CHECK ||
    paymentMethod === PaymentMethodEnum.MONEY_ORDER
  );

  // Default to visible
  visible.paymentMethod = true;
  visible.showPurposeType = true;

  // LOGIC FOR FOR FIELDS THAT ARE REQUIRED ONLY CONDITIONALLY:
  if (visible.checkSelected && isEmpty(checkNumber)) {
    error.checkNumber =
      paymentMethod === PaymentMethodEnum.CHECK
        ? 'Check number is required.'
        : 'Money Order number is required.';
  }

  // PurposeType only required if Miscellaneous Other Disbursement is selected for Sub Type.
  visible.showPurposeType = !!(
    expenditureSubType ===
    ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT
  );

  values._visibleIf = visible;
  return error;
};
