import React from 'react';
import * as Yup from 'yup';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  requiredFormField,
  DynamicOptionField,
  formField,
  stateList,
  checkNoEmptyString,
} from '../../../../components/Forms/Utils/FormsUtils';
import DateField from '../../../../components/Fields/DateField';
import SelectField from '../../../../components/Fields/SelectField';
import TextField from '../../../../components/Fields/TextField';
import PhoneField from '../../../../components/Fields/PhoneField';
import EmailField from '../../../../components/Fields/EmailField';
import CurrencyField from '../../../../components/Fields/CurrencyField';
import AddressLookupField from '../../../../components/Fields/AddressLookupField';
import {
  ContributorTypeFieldEnum,
  ContributionSubTypeFieldEnum,
  PhoneTypeEnum,
  ContributionTypeFieldEnum,
  OaeTypeFieldEnum,
} from '../../../../api/api';

export const FormSectionEnum = Object.freeze({
  BASIC: 'basicsSection',
  CONTRIBUTOR: 'contributorSection',
  OTHER_DETAILS: 'otherDetailsSection',
});

const entityContributorValues = [
  ContributorTypeFieldEnum.BUSINESS_ENTITY,
  ContributorTypeFieldEnum.LABOR_ORGANIZATION,
  ContributorTypeFieldEnum.POLITICAL_COMMITTEE,
  ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE,
  ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE,
  ContributorTypeFieldEnum.OTHER,
];

const individualContributorValues = [
  ContributorTypeFieldEnum.INDIVIDUAL,
  ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY,
];

export const inKindContributionValues = [
  ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION,
  ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT,
  ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL,
];

export const contributionsEmptyState = {
  // BASICS VALUES
  dateOfContribution: '',
  typeOfContribution: '',
  subTypeOfContribution: '',
  typeOfContributor: ContributorTypeFieldEnum.INDIVIDUAL,
  amountOfContribution: '',
  inKindType: '',
  oaeType: '',
  submitForMatch: 'No',
  paymentMethod: '',
  checkNumber: '',

  // CONTRIBUTOR VALUES
  firstName: '',
  lastNameOrEntity: '',
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

export const fields = {
  // BASICS SECTION
  dateOfContribution: {
    label: 'Date of Contribution',
    section: 'FormSectionEnum.BASIC',
    DateField,
    validation: Yup.string('Enter data of contribution'),
    // 'Contribution date is required'
  },
  typeOfContribution: {
    label: 'Type of Contribution',
    section: 'FormSectionEnum.BASIC',
    SelectField,
    validation: Yup.string('Choose the type of contribution'),
    // 'A contribution type is required',
    values: [
      ContributionTypeFieldEnum.CONTRIBUTION,
      ContributionTypeFieldEnum.OTHER,
    ],
  },
  // if typeOfContribution was 'contribution' subTypes are:
  //  - Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable, In-Kind /Forgiven Personal Expenditure
  // If Other Receipt was selected, drop down says:
  //  -  Items Sold at Fair Market Value, Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
  subTypeOfContribution: requiredFormField(
    'Subtype of Contribution',
    FormSectionEnum.BASIC,
    props => (
      <DynamicOptionField
        Component={SelectField}
        props={props}
        check={props.formik.values.typeOfContribution === 'Contribution'}
        trueOptions={{
          values: inKindContributionValues.concat([
            ContributionSubTypeFieldEnum.CASH_CONTRIBUTION,
          ]),
        }}
        falseOptions={{
          values: [
            ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET,
            ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK,
            ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT,
            ContributionSubTypeFieldEnum.REFUND_REBATES,
          ],
        }}
      />
    ),
    Yup.string('Choose the subtype of contribution'),
    'The contribution subtype is required'
  ),
  typeOfContributor: {
    label: 'Type of Contributor',
    section: 'FormSectionEnum.BASIC',
    SelectField,
    validation: Yup.string('Choose the type of contributor'),
    // 'A contributor type is required',
    values: individualContributorValues.concat(entityContributorValues),
  },
  amountOfContribution: {
    label: 'Amount of Contribution',
    section: 'FormSectionEnum.BASIC',
    CurrencyField,
    validation: Yup.number('Choose the amount of contribution'),
    // 'The contribution amount is required'
  },
  oaeType: {
    label: 'OAE Contribution Type',
    section: 'FormSectionEnum.BASIC',
    SelectField,
    validation: Yup.string('Choose the OAE contribution type.'),
    // 'The OAE contribution type is required',
    values: [
      OaeTypeFieldEnum.SEED_MONEY,
      OaeTypeFieldEnum.MATCHABLE,
      OaeTypeFieldEnum.PUBLIC_MATCHING_CONTRIBUTION,
      OaeTypeFieldEnum.QUALIFYING,
      OaeTypeFieldEnum.ALLOWABLE,
      OaeTypeFieldEnum.INKIND,
    ],
  },
  submitForMatch: {
    label: 'Submit for Match?',
    section: 'FormSectionEnum.BASIC',
    SelectField,
    validation: Yup.string('Select yes or no.'),
    // 'This field is required.',
    values: ['Yes', 'No'],
  },
  paymentMethod: {
    label: 'Payment Method',
    section: 'FormSectionEnum.BASIC',
    SelectField,
    validation: Yup.string('Choose the payment method'),
    values: [
      'Cash',
      'Check',
      'Money Order',
      'Credit Card (Online)',
      'Credit Card (Paper Form)',
    ],
  },
  checkNumber: {
    label: 'Check Number',
    section: 'FormSectionEnum.BASIC',
    TextField,
    validation: Yup.number('Enter your check number'),
  },
  // CONTRIBUTOR SECTION
  firstName: {
    label: "Contributor's First Name",
    section: 'FormSectionEnum.CONTRIBUTOR',
    component: TextField,
    validation: Yup.string('Enter first name'),
  },
  // If entity selected, will require entity instead of first/last name
  lastName: {
    label: "Contributor's Last Name",
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string('Enter last name'),
  },
  entityName: {
    label: 'Entity Name',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string('Enter entity name'),
  },
  streetAddress: formField(
    'Street Address',
    FormSectionEnum.CONTRIBUTOR,
    props => (
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
    )
  ),
  addressLine2: {
    label: 'Address Line 2',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string('Enter second address line'),
  },
  city: {
    label: 'City',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string('Select your city'),
    // 'Your city is required'
  },
  state: {
    label: 'State',
    section: 'FormSectionEnum.CONTRIBUTOR',
    SelectField,
    validation: Yup.string('Select your state'),
    // 'Your state is required',
    stateList,
  },
  zipcode: {
    label: 'Zip Code',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.number('Enter your zipcode'),
    // 'A zipcode is required'
  },
  email: {
    label: 'Email Address',
    section: 'FormSectionEnum.CONTRIBUTOR',
    EmailField,
    validation: Yup.string('Enter your email address'),
  },
  phone: {
    label: 'Phone Number',
    section: 'FormSectionEnum.CONTRIBUTOR',
    PhoneField,
    validation: Yup.string('Enter your phone number'),
  },
  phoneType: {
    label: 'Phone Type',
    section: 'FormSectionEnum.CONTRIBUTOR',
    SelectField,
    validation: Yup.string('Select your phone type'),
    values: [PhoneTypeEnum.MOBILE, PhoneTypeEnum.WORK, PhoneTypeEnum.HOME],
  },
  occupation: {
    label: 'Occupation',
    section: 'FormSectionEnum.CONTRIBUTOR',
    SelectField,
    validation: Yup.string('Select your occupation'),
    values: ['Employed', 'Self Employed', 'Not Employed', 'Other'],
  },
  employerName: {
    label: "Employer's Name",
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string("Enter your employer's name"),
  },
  employerCity: {
    label: 'Employer City',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string("Enter your employer's city"),
  },
  employerState: {
    label: 'Employer State',
    section: 'FormSectionEnum.CONTRIBUTOR',
    SelectField,
    validation: Yup.string("Enter your employer's state"),
    stateList,
  },
  employerZipcode: {
    label: 'Employer Zip Code',
    section: 'FormSectionEnum.CONTRIBUTOR',
    TextField,
    validation: Yup.string("Enter your employer's zipcode"),
  },

  // OTHER DETAILS SECTION
  electionAggregate: {
    label: 'Election Aggregate',
    section: 'FormSectionEnum.OTHER_DETAILS',
    TextField,
    validation: Yup.number('Enter your election aggregate'),
    // 'Election aggregate is required'
  },
  // REQUIRED IF: In-Kind Contribution, In-Kind Forgiven Accounts Payable,
  // or In-Kind Forgiven Personal Expenditure was selection.
  inKindDescription: {
    label: 'Inkind Description',
    section: 'FormSectionEnum.OTHER_DETAILS',
    TextField,
    validation: Yup.string('Give a description of the inkind contribution'),
  },
  inKindType: {
    label: 'Inkind Type',
    section: 'FormSectionEnum.OTHER_DETAILS',
    SelectField,
    validation: Yup.string('Select type of inkind contribution'),
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
  // Not required if occupation & employer name/address filled in
  occupationLetterDate: {
    label: 'Occupation Letter Date',
    section: 'FormSectionEnum.OTHER_DETAILS',
    DateField,
    validation: Yup.date('Enter occupation letter date'),
  },
  // Required UNLESS the payment method is Credit Card (Online).
  // or if there is a donor portal where donors can attest digitally, that may affect this
  linkToDocumentation: {
    label: 'Link to Documentation?',
    section: 'FormSectionEnum.OTHER_DETAILS',
    TextField,
    validation: Yup.string(
      'Provide a link to documentation of your contribution'
    ),
  },
  notes: {
    label: 'Notes?',
    section: 'FormSectionEnum.OTHER_DETAILS',
    TextField,
    validation: Yup.string('Add any additional notes'),
  },
};

export const validate = values => {
  const {
    typeOfContribution,
    paymentMethod,
    checkNumber,
    linkToDocumentation,
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

  if (paymentMethod === 'Check' && !checkNoEmptyString(checkNumber)) {
    error.checkNumber = 'Check number is required.';
  }
  if (paymentMethod === 'Money Order' && !checkNoEmptyString(checkNumber)) {
    error.checkNumber = 'Money Order number is required.';
  }

  const isPerson = !!individualContributorValues.includes(typeOfContributor);
  if (
    inKindContributionValues.includes(subTypeOfContribution) &&
    !checkNoEmptyString(inKindType)
  ) {
    error.inKindType = 'Inkind type is required';
  }
  if (
    subTypeOfContribution === ContributionSubTypeFieldEnum.CASH_CONTRIBUTION &&
    !checkNoEmptyString(subTypeOfContribution)
  ) {
    error.paymentMethod = 'Payment method type is required';
  }

  // If it's a person require first and last name
  // else require entity name
  if (isPerson) {
    if (!checkNoEmptyString(firstName)) {
      error.firstName = 'First name is required.';
    }
    if (!checkNoEmptyString(lastName)) {
      error.lastName = 'Last name is required.';
    }
  } else if (!checkNoEmptyString(entityName)) {
    error.entityName = 'Name of entity is required';
  }

  // They are employed and they don't have a letter require employer info
  if (occupation === 'Employed' && isPerson) {
    // If they don't have a letter then the employer fields are required
    if (!checkNoEmptyString(occupationLetterDate)) {
      if (!checkNoEmptyString(employerName)) {
        error.employerName = 'Employer name is required.';
      }
      if (!checkNoEmptyString(employerCity)) {
        error.employerCity = 'Employer city is required.';
      }
      if (!checkNoEmptyString(employerState)) {
        error.employerState = 'Employer state is required.';
      }
      if (!checkNoEmptyString(employerZipcode)) {
        error.employerZipcode = 'Employer zipcode is required.';
      }
    }
  }
  console.log('Form will submit error is empty', error);
  return error;
};
