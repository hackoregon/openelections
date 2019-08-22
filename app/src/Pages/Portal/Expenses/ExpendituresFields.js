import React from 'react';
import * as Yup from 'yup';

import Form from '../../../components/Form/Form';
import CurrencyField from '../../../components/Fields/CurrencyField';
import DateField from '../../../components/Fields/DateField';
import SelectField from '../../../components/Fields/SelectField';
import TextField from '../../../components/Fields/TextField';
import AddressLookupField from '../../../components/Fields/AddressLookupField';
import { stateList } from '../../../components/Forms/Utils/FormsUtils';

export const expendituresEmptyState = {
  // BASICS VALUES
  amount: '',
  dateOfExpenditure: '',
  typeOfExpenditure: '',
  subTypeOfExpenditure: '',
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
  dateOfExpenditure: {
    label: 'Date of Expenditure',
    component: DateField,
    validation: Yup.number().required('An expenditure date is required'),
  },
  typeOfExpenditure: {
    label: 'Type of Expenditure',
    component: SelectField,
    options: {
      values: ['Expenditure', 'Other', 'Other Disbursement'],
    },
    validation: Yup.string().required('An expenditure type is required'),
  },
  subTypeOfExpenditure: {
    label: 'Subtype of Expenditure',
    component: SelectField,
    options: {
      // If Expenditure Type is “Expenditure,” drop down says: Accounts Payable, Cash Expenditure, Personal Expenditure for Reimbursement.
      values: [
        'Accounts Payable',
        'Cash Expenditure',
        'Personal Expenditure for Reimbursement',
      ],
      // If Expenditure Type is “Other.” drop down says: Accounts Payable Rescinded, Cash Balance Adjustment (maybe)
      // values: [
      //   "Accounts Payable Rescinded",
      //   "Cash Balance Adjustment"  // maybe
      // ]

      // If Expenditure Type is “Other Disbursement,” drop down says: Miscellaneous Other Disbursement, Return or Refund of Contribution.
      // values: [
      //   "Miscellaneous",
      //   "Other Disbursement",
      //   "Return or Refund of Contribution"
      // ]
    },
    validation: Yup.string().required('The Expenditure subtype is required'),
  },
  paymentMethod: {
    label: 'Payment Method',
    component: SelectField,
    options: {
      values: [
        'Cash',
        'Check',
        'Money Order',
        'Credit Card (Online)',
        'Credit Card (Paper Form)',
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
    // REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.
  },

  // PAYEE SECTION
  payeeType: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: 'Payee Type',
    component: SelectField,
    options: {
      values: ['Individual', 'Business Entity', 'Candidate'],
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

export default ExpensesDetailForm;
