import React from 'react';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
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
} from '../../../api/api';

export const FormSectionEnum = Object.freeze({
  BASIC: 'basicsSection',
  PAYEE_INFO: 'payeeInfoSection',
});

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
  countryRegion: '',
  city: '',
  state: '',
  zipcode: '',
  county: '',
  notes: '',
};

// Converts TypeFieldMap to options for a select
// ie: DataToContributorTypeFieldMap
// Just a patch DO NOT USE outside of this file
export const mapToSelectOptions = mapPairs => {
  const acc = [];
  mapPairs.forEach((label, value) => {
    acc.push({ value, label });
  });
  return acc;
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
    validation: Yup.number().required('An expenditure date is required'),
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
      // If Expenditure Type is “Expenditure,” drop down says: Accounts Payable, Cash Expenditure, Personal Expenditure for Reimbursement.
      values: [
        ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
        ExpenditureSubTypeEnum.CASH_EXPENDITURE,
        ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
      ],
      // If Expenditure Type is “Other.” drop down says: Accounts Payable Rescinded, Cash Balance Adjustment (maybe)
      // values: [
      //   ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
      //   ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT,
      // ]

      // If Expenditure Type is “Other Disbursement,” drop down says: Miscellaneous Other Disbursement, Return or Refund of Contribution.
      // values: [
      //   ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
      //   ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION,
      // ]
    },
    validation: Yup.string().required('The Expenditure subtype is required'),
  },
  paymentMethod: {
    label: 'Payment Method',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        'Check',
        'Credit Card',
        'Debit Card',
        'Electronic Check',
        'Electronic Funds Transfer',
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
        'Broadcast Advertising',
        'Cash Contribution',
        'Fundraising Event Expenses',
        'General Operating Expenses',
        'Literature/Brochures/Printing',
        'Management Services',
        'Newspaper and Other Periodical Advertising',
        'Other Advertising',
        'Petition Circulators',
        'Postage',
        'Preparation and Production of Advertising',
        'Surveys and Polls',
        'Travel Expenses',
        'Utilities',
        'Wages/Salaries/Benefits',
        'Reimbursement for Personal Expenditures',
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
  countryRegion: {
    label: 'Country/Region',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string().required(
      "The payee's country or region is required"
    ),
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
  county: {
    label: 'County',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string().required("The payee's county is required"),
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
    // expenditureSubType,
    // paymentMethod,
    // checkNumber,
    // purposeType,

    // // PAYEE INFO
    payeeType,
    // payeeName,
    // streetAddress,
    // addressLine2,
    // countryRegion,
    // city,
    // state,
    // zipcode,
    // county,
    // notes,
  } = values;
  // const error = {};
  const visible = {};

  // LOGIC FOR CONDITIONALLY VISIBLE FIELDS OR DROPDOWN SELECT OPTIONS:

  // Make these areas visible
  visible.isPerson = !!(
    payeeType === PayeeTypeEnum.INDIVIDUAL || payeeType === PayeeTypeEnum.FAMILY
  );
  // EXPENDITURE TYPE SELECT VALUES:
  // If Expenditure Type is “Expenditure,” drop down says: Accounts Payable, Cash Expenditure, Personal Expenditure for Reimbursement.
  // values: [
  //   ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
  //   ExpenditureSubTypeEnum.CASH_EXPENDITURE,
  //   ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
  // ],

  // If Expenditure Type is “Other.” drop down says: Accounts Payable Rescinded, Cash Balance Adjustment (maybe)
  // values: [
  //   ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
  //   ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT, (maybe)
  // ]

  // If Expenditure Type is “Other Disbursement,” drop down says: Miscellaneous Other Disbursement, Return or Refund of Contribution.
  // values: [
  //   ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
  //   ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION, - no longer?
  // ]

  // If PaymentMethod was check, show check number field

  // LOGIC FOR FOR FIELDS THAT ARE REQUIRED ONLY CONDITIONALLY:

  // purposeType:
  // REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.
};
