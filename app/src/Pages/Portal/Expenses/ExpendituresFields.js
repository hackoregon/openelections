import React from 'react';
import * as Yup from 'yup';

import Form from '../../../components/Form/Form';
import CurrencyField from '../../../components/Fields/CurrencyField';
import DateField from '../../../components/Fields/DateField';
import SelectField from '../../../components/Fields/SelectField';
import TextField from '../../../components/Fields/TextField';
import AddressLookupField from '../../../components/Fields/AddressLookupField';
import { stateList } from '../../../components/Forms/Utils/FormsUtils';
import {
  ExpenditureTypeEnum,
  ExpenditureSubTypeEnum,
  PayeeTypeEnum,
} from '../../../api/api';

export const expendituresEmptyState = {
  // KELLY does this ^ even do anything?
  // BASICS VALUES
  amount: '',
  dateOfExpenditure: '',
  expenditureType: '',
  expenditureSubType: '',
  paymentMethod: '',
  checkNumber: '',
  purposeOfExpenditure: '',

  // PAYEE INFO
  payeeType: '',
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

const fields = {
  // BASICS SECTION
  amount: {
    label: 'Amount of Expenditure',
    component: CurrencyField,
    validation: Yup.number().required('The expenditure amount is required'),
  },
  date: {
    label: 'Date of Expenditure',
    component: DateField,
    validation: Yup.number().required('An expenditure date is required'),
  },
  expenditureType: {
    label: 'Expenditure Type',
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
    component: TextField,
    validation: Yup.number().required('Check number is required'),
  },
  purposeOfExpenditure: {
    label: 'Purpose of Expenditure',
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
    // purposeOfExpenditure IS REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.
  },

  // PAYEE SECTION
  payeeType: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: 'Payee Type',
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
    component: TextField,
    validation: Yup.string().required("The payee's name is required"),
  },
  streetAddress: {
    label: 'Street Address/PO Box',
    component: AddressLookupField,
    validation: Yup.string().required("The payee's street address is required"),
  },
  addressLine2: {
    label: 'Address Line 2',
    component: TextField,
    // NO VALIDATION BECAUSE NOT REQUIRED?
  },
  countryRegion: {
    label: 'Country/Region',
    component: TextField,
    validation: Yup.string().required(
      "The payee's country or region is required"
    ),
  },
  city: {
    label: 'City',
    component: TextField,
    validation: Yup.string().required("The payee's city is required"),
  },
  state: {
    label: 'State',
    component: SelectField,
    options: {
      values: { stateList },
      validation: Yup.string().required('Your state is required'),
    },
    zipcode: {
      label: 'Zipcode',
      component: TextField,
      validation: Yup.number().required('A zipcode is required'),
    },
    county: {
      label: 'County',
      component: TextField,
      validation: Yup.string().required("The payee's county is required"),
    },

    notes: {
      label: 'Notes',
      component: TextField,
      validation: Yup.string(),
    },
  },
};

const ExpensesDetailForm = ({ initialValues, onSubmit, children }) => (
  <>
    <Form fields={fields} initialValues={initialValues} onSubmit={onSubmit}>
      {children}
    </Form>
  </>
);

// LOGIC FOR CONDITIONALLY VISIBLE FIELDS OR DROPDOWN SELECT OPTIONS:

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

// LOGIC FOR FOR FIELDS THAT ARE REQUIRED ONLY CONDITIONALLY:

// purposeOfExpenditure:
// REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.

export default ExpensesDetailForm;
