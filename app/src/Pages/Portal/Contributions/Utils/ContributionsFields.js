import React from 'react';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  stateList,
} from '../../../../components/Forms/Utils/FormsUtils';
import DateField from '../../../../components/Fields/DateField';
import SelectField from '../../../../components/Fields/SelectField';
import TextField from '../../../../components/Fields/TextField';
import PhoneField from '../../../../components/Fields/PhoneField';
import EmailField from '../../../../components/Fields/EmailField';
import CurrencyField from '../../../../components/Fields/CurrencyField';
import AddressLookupField from '../../../../components/Fields/AddressLookupField';
import {
  PhoneTypeEnum,
  ContributionTypeFieldEnum,
  OaeTypeFieldEnum,
  DataToContributionTypeFieldMap,
  DataToContributionSubTypeFieldMap,
  DataToContributorTypeFieldMap,
  ContributionSubTypeEnum,
  ContributionTypeEnum,
  ContributorTypeEnum,
} from '../../../../api/api';

export const FormSectionEnum = Object.freeze({
  BASIC: 'basicsSection',
  CONTRIBUTOR: 'contributorSection',
  OTHER_DETAILS: 'otherDetailsSection',
});

export const inKindContributionValues = [
  ContributionSubTypeEnum.INKIND_CONTRIBUTION,
  ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT,
  ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL,
];

export const contributionsEmptyState = {
  // BASICS VALUES
  dateOfContribution: '',
  typeOfContribution: ContributionTypeEnum.CONTRIBUTION,
  subTypeOfContribution: '',
  typeOfContributor: ContributorTypeEnum.INDIVIDUAL,
  amountOfContribution: '',
  inKindType: '',
  oaeType: '',
  submitForMatch: 'No',
  paymentMethod: '',
  checkNumber: '',

  // CONTRIBUTOR VALUES
  firstName: '',
  lastName: '',
  entityName: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: 'OR',
  zipcode: '97201',
  email: '',
  phone: '',
  phoneType: '',
  occupation: '',
  employerName: '',
  employerCity: '',
  employerState: '',
  employerZipcode: '',

  // OTHER DETAILS VALUES
  electionAggregate: '',
  inKindDescription: '',
  occupationLetterDate: '',
  linkToDocumentation: '',
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
  dateOfContribution: {
    label: 'Date of Contribution',
    section: FormSectionEnum.BASIC,
    component: DateField,
    validation: Yup.string().required('Contribution date is required'),
  },
  typeOfContribution: {
    label: 'Type of Contribution',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string().required('A contribution type is required'),
    options: {
      values: mapToSelectOptions(DataToContributionTypeFieldMap),
      valuesold: [
        ContributionTypeFieldEnum.CONTRIBUTION,
        ContributionTypeFieldEnum.OTHER,
      ],
    },
  },
  // if typeOfContribution was 'contribution' subTypes are:
  //  - Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable, In-Kind /Forgiven Personal Expenditure
  // If Other Receipt was selected, drop down says:
  //  -  Items Sold at Fair Market Value, Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
  subTypeOfContribution: {
    label: 'Subtype of Contribution',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    options: {
      values: mapToSelectOptions(DataToContributionSubTypeFieldMap),
      limitByField: 'typeOfContribution',
      limitByValues: {
        contribution: [
          ContributionSubTypeEnum.CASH,
          ContributionSubTypeEnum.INKIND_CONTRIBUTION,
          ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT,
          ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL,
          ContributionSubTypeEnum.INKIND_PAID_SUPERVISION,
        ],
        other: [
          ContributionSubTypeEnum.ITEM_SOLD_FAIR_MARKET,
          ContributionSubTypeEnum.ITEM_RETURNED_CHECK,
          ContributionSubTypeEnum.ITEM_MISC,
          ContributionSubTypeEnum.ITEM_REFUND,
        ],
      },
    },
    validation: Yup.string().required('The contribution subtype is required'),
  },
  typeOfContributor: {
    label: 'Type of Contributor',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string(),
    // 'A contributor type is required',
    options: {
      values: mapToSelectOptions(DataToContributorTypeFieldMap),
    },
  },
  amountOfContribution: {
    label: 'Amount of Contribution',
    section: FormSectionEnum.BASIC,
    component: CurrencyField,
    validation: Yup.number().required('The contribution amount is required'),
  },
  oaeType: {
    label: 'OAE Contribution Type',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string(),
    // 'The OAE contribution type is required',
    options: {
      values: [
        OaeTypeFieldEnum.SEED_MONEY,
        OaeTypeFieldEnum.MATCHABLE,
        OaeTypeFieldEnum.PUBLIC_MATCHING_CONTRIBUTION,
        OaeTypeFieldEnum.QUALIFYING,
        OaeTypeFieldEnum.ALLOWABLE,
        OaeTypeFieldEnum.INKIND,
      ],
    },
  },
  submitForMatch: {
    label: 'Submit for Match?',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string(),
    // 'This field is required.',
    options: { values: ['Yes', 'No'] },
  },
  paymentMethod: {
    label: 'Payment Method',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string(),
    options: {
      values: [
        'Cash',
        'Check',
        'Money Order',
        'Credit Card (Online)',
        'Credit Card (Paper Form)',
      ],
    },
  },
  checkNumber: {
    label: 'Check Number',
    section: FormSectionEnum.BASIC,
    component: TextField,
    validation: Yup.number().typeError('Must be a number'),
  },
  // CONTRIBUTOR SECTION
  firstName: {
    label: "Contributor's First Name",
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  // If entity selected, will require entity instead of first/last name
  lastName: {
    label: "Contributor's Last Name",
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  entityName: {
    label: 'Entity Name',
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  streetAddress: {
    label: 'Street Address',
    section: FormSectionEnum.CONTRIBUTOR,
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
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  city: {
    label: 'City',
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string().required('Your city is required'),
  },
  state: {
    label: 'State',
    section: FormSectionEnum.CONTRIBUTOR,
    component: SelectField,
    validation: Yup.string().required('Your state is required'),
    options: { values: stateList },
  },
  zipcode: {
    label: 'Zip Code',
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.number().required('Your zipcode is required'),
  },
  email: {
    label: 'Email Address',
    section: FormSectionEnum.CONTRIBUTOR,
    component: EmailField,
    validation: Yup.string(),
  },
  phone: {
    label: 'Phone Number',
    section: FormSectionEnum.CONTRIBUTOR,
    component: PhoneField,
    validation: Yup.string(),
  },
  phoneType: {
    label: 'Phone Type',
    section: FormSectionEnum.CONTRIBUTOR,
    component: SelectField,
    validation: Yup.string(),
    options: {
      values: [PhoneTypeEnum.MOBILE, PhoneTypeEnum.WORK, PhoneTypeEnum.HOME],
    },
  },
  occupation: {
    label: 'Occupation',
    section: FormSectionEnum.CONTRIBUTOR,
    component: SelectField,
    validation: Yup.string(),
    options: { values: ['Employed', 'Self Employed', 'Not Employed', 'Other'] },
  },
  employerName: {
    label: "Employer's Name",
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  employerCity: {
    label: 'Employer City',
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },
  employerState: {
    label: 'Employer State',
    section: FormSectionEnum.CONTRIBUTOR,
    component: SelectField,
    validation: Yup.string(),
    options: { values: stateList },
  },
  employerZipcode: {
    label: 'Employer Zip Code',
    section: FormSectionEnum.CONTRIBUTOR,
    component: TextField,
    validation: Yup.string(),
  },

  // OTHER DETAILS SECTION
  electionAggregate: {
    label: 'Election Aggregate',
    section: FormSectionEnum.OTHER_DETAILS,
    component: TextField,
    validation: Yup.number(),
    // 'Election aggregate is required'
  },
  // REQUIRED IF: In-Kind Contribution, In-Kind Forgiven Accounts Payable,
  // or In-Kind Forgiven Personal Expenditure was selection.
  inKindDescription: {
    label: 'Inkind Description',
    section: FormSectionEnum.OTHER_DETAILS,
    component: TextField,
    validation: Yup.string(),
  },
  inKindType: {
    // TODO Check that is posts all the way to the DB
    label: 'Inkind Type',
    section: FormSectionEnum.OTHER_DETAILS,
    component: SelectField,
    validation: Yup.string(),
    options: {
      values: [
        { value: 'broadcast_advertising', label: 'Broadcast Advertising' },
        {
          value: 'fundraising_event_expenses',
          label: 'Fundraising Event Expenses',
        },
        {
          value: 'general_operating_expenses',
          label: 'General Operating Expenses',
        },
        { value: 'printing', label: 'Literature/Brochures/Printing' },
        { value: 'management', label: 'Management Services' },
        {
          value: 'print_advertising',
          label: 'Newspaper and Other Periodical Advertising',
        },
        { value: 'other_advertising', label: 'Other Advertising' },
        { value: 'petition_Circulators', label: 'Petition Circulators' },
        { value: 'postage', label: 'Postage' },
        {
          value: 'preparation_of_advertising',
          label: 'Preparation and Production of Advertising',
        },
        { value: 'surveys_and_polls', label: 'Surveys and Polls' },
        { value: 'travel_expenses', label: 'Travel Expenses' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'wages', label: 'Wages/Salaries/Benefits' },
      ],
    },
  },
  // Not required if occupation & employer name/address filled in
  occupationLetterDate: {
    label: 'Occupation Letter Date',
    section: FormSectionEnum.OTHER_DETAILS,
    component: DateField,
    validation: Yup.date(),
  },
  // Required UNLESS the payment method is Credit Card (Online).
  // or if there is a donor portal where donors can attest digitally, that may affect this
  linkToDocumentation: {
    label: 'Link to Documentation?',
    section: FormSectionEnum.OTHER_DETAILS,
    component: TextField,
    validation: Yup.string(),
  },
  notes: {
    label: 'Notes?',
    section: FormSectionEnum.OTHER_DETAILS,
    component: TextField,
    validation: Yup.string(),
  },
};

// Uses Formik validate, with an additional object _visibleIf
// Any boolean properties set on passed _visibleIf are passed to the form
// All conditional display and required logic goes in validate
// All static type and required field properties are set in the fields object
// TODO create interface
export const validate = values => {
  const {
    amountOfContribution,
    typeOfContribution,
    paymentMethod,
    checkNumber,
    occupation,
    occupationLetterDate,
    employerName,
    employerCity,
    employerState,
    employerZipcode,
    subTypeOfContribution,
    inKindType,
    lastName,
    entityName,
    firstName,
    typeOfContributor,
  } = values;
  const error = {};
  const visible = {};

  // Make these areas visible
  visible.isPerson = !!(
    typeOfContributor === ContributorTypeEnum.INDIVIDUAL ||
    typeOfContributor === ContributorTypeEnum.FAMILY
  );

  visible.checkSelected = !!(
    paymentMethod === 'Check' || paymentMethod === 'Money Order'
  );
  visible.paymentMethod = !!(
    subTypeOfContribution === ContributionSubTypeEnum.CASH
  );
  visible.emptyOccupationLetterDate = occupationLetterDate === '';

  visible.showEmployerSection =
    values.occupation === 'Employed' && visible.isPerson;

  visible.showInKindFields = !!inKindContributionValues.includes(
    subTypeOfContribution
  );

  // These fields are conditionally required
  if (visible.showInKindFields && isEmpty(inKindType))
    error.inKindType = 'Inkind type is required';

  if (visible.checkSelected && isEmpty(checkNumber)) {
    error.checkNumber =
      paymentMethod === 'Check'
        ? 'Check number is required.'
        : 'Money Order number is required.';
  }

  if (
    subTypeOfContribution === ContributionSubTypeEnum.CASH &&
    isEmpty(paymentMethod)
  ) {
    error.paymentMethod = 'Payment method type is required';
  }

  // If it's a person require first and last name
  // else require entity name
  if (visible.isPerson) {
    if (isEmpty(firstName)) {
      error.firstName = 'First name is required.';
    }
    if (isEmpty(lastName)) {
      error.lastName = 'Last name is required.';
    }
  } else if (isEmpty(entityName)) {
    error.entityName = 'Name of entity is required';
  }

  // They are employed and they don't have a letter require employer info
  if (occupation === 'Employed' && visible.isPerson) {
    // If they don't have a letter then the employer fields are required
    if (isEmpty(occupationLetterDate)) {
      if (isEmpty(employerName)) {
        error.employerName = 'Employer name is required.';
      }
      if (isEmpty(employerCity)) {
        error.employerCity = 'Employer city is required.';
      }
      if (isEmpty(employerState)) {
        error.employerState = 'Employer state is required.';
      }
      if (isEmpty(employerZipcode)) {
        error.employerZipcode = 'Employer zipcode is required.';
      }
    }
  }

  // Conditionally Set Values
  if (values.submitForMatch !== 'No') {
    if (
      // Set submitForMatch to No under these conditions
      amountOfContribution > 500 ||
      typeOfContribution !== ContributionTypeEnum.CONTRIBUTION ||
      subTypeOfContribution !== ContributionSubTypeEnum.CASH ||
      !visible.isPerson
    ) {
      values.submitForMatch = 'No';
    }
  }

  // console.log('Conditional require', error);
  console.log('Conditionally Visible', visible);
  error._visibleIf = visible;
  return error;
};
