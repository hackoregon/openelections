import React from 'react';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { format } from 'date-fns';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { parseFromTimeZone, convertToTimeZone } from 'date-fns-timezone';
import { stateList } from '../../../components/Forms/Utils/FormsUtils';
import CurrencyField from '../../../components/Fields/CurrencyField';
import DateField from '../../../components/Fields/DateField';
import SelectField from '../../../components/Fields/SelectField';
import TextField from '../../../components/Fields/TextField';
import AddressLookupField from '../../../components/Fields/AddressLookupField';
import ZipField from '../../../components/Fields/ZipField';
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
    createdAt,
    buttonSubmitted,
    amount,
    date,
    type,
    subType,
    paymentMethod,
    checkNumber,
    purpose,
    payeeType,
    name,
    address1,
    address2,
    city,
    state,
    zip,
    notes,
    status,
    updatedAt,
    campaign,
    dateOriginalTransaction,
    vendorForOriginalPurchase,
  } = expenditure;
  return {
    id,
    createdAt,
    buttonSubmitted: buttonSubmitted || '',
    amount: amount.toFixed(2) || '',
    date: format(
      new Date(parseFromTimeZone(date, { timeZone: 'America/Los_Angeles' })),
      'YYYY-MM-DD'
    ),
    expenditureType: type,
    expenditureSubType: subType,
    paymentMethod,
    checkNumber: checkNumber || '',
    purposeType: purpose || null,
    payeeType,
    payeeName: name,
    streetAddress: address1,
    addressLine2: address2 || '',
    city,
    state,
    zipcode: zip,
    notes: notes || '',
    status,
    updatedAt: format(new Date(updatedAt), 'MM-DD-YY hh:mm a'),
    campaignName: campaign && campaign.name ? campaign.name : null,
    dateOriginalTransaction: format(
      new Date(
        parseFromTimeZone(dateOriginalTransaction, {
          timeZone: 'America/Los_Angeles',
        })
      ),
      'YYYY-MM-DD'
    ),
    vendorForOriginalPurchase: '',
  };
};

export const mapExpenditureFormToData = data => {
  const {
    amount,
    date,
    expenditureType,
    expenditureSubType,
    checkNumber,
    paymentMethod,
    purposeType,
    payeeType,
    payeeName,
    streetAddress,
    addressLine2,
    city,
    state,
    zipcode,
    notes,
    status,
    dateOriginalTransaction,
    vendorForOriginalPurchase,
  } = data;

  const transformed = {
    amount: parseFloat(amount),
    date: new Date(
      convertToTimeZone(date, { timeZone: 'America/Los_Angeles' })
    ).getTime(),
    type: expenditureType,
    subType: expenditureSubType,
    checkNumber,
    paymentMethod,
    purpose: purposeType || null,
    payeeType,
    name: payeeName.trim(),
    address1: streetAddress,
    address2: addressLine2,
    city,
    state,
    zip: zipcode,
    notes,
    status,
    dateOriginalTransaction,
    vendorForOriginalPurchase,
  };
  return transformed;
};

export const expendituresEmptyState = {
  // BASICS VALUES
  id: '',
  amount: '',
  date: '',
  expenditureType: '',
  expenditureSubType: '',
  paymentMethod: '',
  checkNumber: '',
  purposeType: '',
  dateOriginalTransaction: '',
  vendorForOriginalPurchase: '',

  // PAYEE INFO
  payeeType: PayeeTypeEnum.INDIVIDUAL,
  payeeName: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: 'OR',
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
    InputLabelProps: { shrink: true },
    options: {
      values: [
        { value: ExpenditureTypeEnum.EXPENDITURE, label: 'Expenditure' },
        { value: ExpenditureTypeEnum.OTHER, label: 'Other' },
        {
          value: ExpenditureTypeEnum.OTHER_DISBURSEMENT,
          label: 'Other Disbursement',
        },
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
        {
          value: ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
          label: 'Accounts Payable',
        },
        {
          value: ExpenditureSubTypeEnum.CASH_EXPENDITURE,
          label: 'Cash Expenditure',
        },
        {
          value: ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
          label: 'Personal Expenditure',
        },
        {
          value: ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
          label: 'Accounts Payable Rescinded',
        },
        {
          value: ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT,
          label: 'Cash Balance Adjustment',
        },
        {
          value: ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
          label: 'Miscellaneous Other Disbursement',
        },
        {
          value: ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION,
          label: 'Refund of Contribution',
        },
      ],
      limitByField: 'expenditureType',
      limitByValues: {
        expenditure: [
          ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE,
          ExpenditureSubTypeEnum.CASH_EXPENDITURE,
          ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE,
        ],
        other: [
          ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED,
          ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT,
        ],
        other_disbursement: [
          ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT,
          ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION,
        ],
      },
    },
    validation: Yup.string().required('The Expenditure subtype is required'),
  },
  dateOriginalTransaction: {
    label: 'Date of Original Transaction',
    section: FormSectionEnum.BASIC,
    component: DateField,
    validation: Yup.string(),
  },
  vendorForOriginalPurchase: {
    label: 'Vendor for Original Purchase',
    section: FormSectionEnum.BASIC,
    component: TextField,
    validation: Yup.string(),
  },
  paymentMethod: {
    label: 'Payment Method',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: [
        { value: PaymentMethodEnum.CASH, label: 'Cash' },
        { value: PaymentMethodEnum.CHECK, label: 'Check' },
        { value: PaymentMethodEnum.MONEY_ORDER, label: 'Money Order' },
        {
          value: PaymentMethodEnum.CREDIT_CARD_ONLINE,
          label: 'Credit Card Online',
        },
        {
          value: PaymentMethodEnum.CREDIT_CARD_PAPER,
          label: 'Credit Card Paper',
        },
      ],
    },
    validation: Yup.string().required('The payment method is required'),
  },
  checkNumber: {
    label: 'Check Number',
    section: FormSectionEnum.BASIC,
    component: TextField,
    validation: Yup.number().typeError('Must be a number'),
  },
  purposeType: {
    label: 'Purpose of Expenditure',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string().nullable(),
    options: {
      values: [
        { value: PurposeTypeEnum.WAGES, label: 'Wages' },
        { value: PurposeTypeEnum.CASH, label: 'Cash' },
        { value: PurposeTypeEnum.REIMBURSEMENT, label: 'Reimbursement' },
        { value: PurposeTypeEnum.BROADCAST, label: 'Broadcast' },
        { value: PurposeTypeEnum.FUNDRAISING, label: 'Fundraising' },
        {
          value: PurposeTypeEnum.GENERAL_OPERATING,
          label: 'General Operating',
        },
        { value: PurposeTypeEnum.PRIMTING, label: 'Printing' },
        { value: PurposeTypeEnum.MANAGEMENT, label: 'Management' },
        { value: PurposeTypeEnum.NEWSPAPER, label: 'Newspaper' },
        { value: PurposeTypeEnum.OTHER_AD, label: 'Other Ad' },
        { value: PurposeTypeEnum.PETITION, label: 'Petition' },
        { value: PurposeTypeEnum.POSTAGE, label: 'Postage' },
        { value: PurposeTypeEnum.PREP_AD, label: 'Prep Ad' },
        { value: PurposeTypeEnum.POLLING, label: 'Pollilng' },
        { value: PurposeTypeEnum.TRAVEL, label: 'Travel' },
        { value: PurposeTypeEnum.UTILITIES, label: 'Utilities' },
      ],
    },
  },

  // PAYEE SECTION
  payeeType: {
    label: 'Payee Type',
    defaultValue: '',
    section: FormSectionEnum.PAYEE_INFO,
    component: SelectField,
    options: {
      values: [
        { value: PayeeTypeEnum.INDIVIDUAL, label: 'Individual' },
        { value: PayeeTypeEnum.BUSINESS, label: 'Business' },
        { value: PayeeTypeEnum.FAMILY, label: 'Family' },
        { value: PayeeTypeEnum.LABOR, label: 'Labor' },
        {
          value: PayeeTypeEnum.POLITICAL_COMMITTEE,
          label: 'Political Committee',
        },
        { value: PayeeTypeEnum.POLITICAL_PARTY, label: 'Political Party' },
        { value: PayeeTypeEnum.UNREGISTERED, label: 'Unregistered' },
        { value: PayeeTypeEnum.OTHER, label: 'Other' },
      ],
    },
    validation: Yup.string().required('The payee type is required'),
  },
  payeeName: {
    label: "Payee's Name",
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string()
      .matches(
        /^[\p{L}'][ \p{L}'-]*[ \p{L}]$/u,
        'Names must only contain letters or hyphens.',
        {
          excludeEmptyString: true,
        }
      )
      .nullable(),
  },
  streetAddress: {
    label: 'Street Address',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
    validation: Yup.string().required('Your street address is required'),
  },

  addressLine2: {
    label: 'Address Line 2',
    section: FormSectionEnum.PAYEE_INFO,
    component: TextField,
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
    validation: Yup.string().required('Your state is required'),
  },
  zipcode: {
    label: 'Zipcode',
    section: FormSectionEnum.PAYEE_INFO,
    component: ZipField,
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
    expenditureSubType,
    paymentMethod,
    checkNumber,
    purposeType,
    dateOriginalTransaction,
    vendorForOriginalPurchase,
  } = values;
  const error = {};
  const visible = {};

  // LOGIC FOR CONDITIONALLY VISIBLE FIELDS OR DROPDOWN SELECT OPTIONS:

  // If PaymentMethod was check, show check number field
  visible.checkSelected = !!(
    paymentMethod === PaymentMethodEnum.CHECK ||
    paymentMethod === PaymentMethodEnum.MONEY_ORDER
  );

  visible.showOriginalDateAndVendor = !!(
    expenditureSubType === ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE
  );

  // If Expenditure Subtype is personal expenditure
  if (visible.showOriginalDateAndVendor && isEmpty(dateOriginalTransaction)) {
    error.dateOriginalTransaction =
      'Date of the original transaction is required';
  }
  if (visible.showOriginalDateAndVendor && isEmpty(vendorForOriginalPurchase)) {
    error.vendorForOriginalPurchase =
      'Name of vendor for original purchase is required';
  }

  // Default to visible
  visible.paymentMethod = true;
  visible.showPurposeType = false;
  // visible.dateOriginalTransaction = false;

  // LOGIC FOR FOR FIELDS THAT ARE REQUIRED ONLY CONDITIONALLY:
  if (visible.checkSelected && isEmpty(checkNumber)) {
    error.checkNumber =
      paymentMethod === PaymentMethodEnum.CHECK
        ? 'Check number is required.'
        : 'Money Order number is required.';
  }

  // PurposeType only visble & required if Miscellaneous Other Disbursement is selected for Sub Type.
  visible.showPurposeType = !!(
    expenditureSubType ===
    ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT
  );

  if (visible.showPurposeType && isEmpty(purposeType)) {
    error.purposeType = 'A description of type of purpose is required';
  }

  values._visibleIf = visible;
  return error;
};
