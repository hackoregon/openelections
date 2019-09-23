import React from 'react';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { parseFromTimeZone, convertToTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { stateList } from '../../../../components/Forms/Utils/FormsUtils';
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
  DataToContributionTypeFieldMap,
  DataToContributionSubTypeFieldMap,
  DataToContributorTypeFieldMap,
  ContributionSubTypeEnum,
  ContributionTypeEnum,
  ContributorTypeEnum,
  PaymentMethodEnum,
  DataToOaeTypeTypeFieldMap,
  InKindDescriptionTypeEnum,
} from '../../../../api/api';
import { campaign } from '../../../../api/schema';

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

export const mapContributionDataToForm = contribution => {
  const {
    id,
    buttonSubmitted,
    date,
    updatedAt,
    type,
    subType,
    contributorType,
    inKindType,
    oaeType,
    amount,
    checkNumber,
    name,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    email,
    phone,
    phoneType,
    occupation,
    paymentMethod,
    employerName,
    employerCity,
    employerState,
    inKindDescription,
    occupationLetterDate,
    status,
    notes,
    campaign,
  } = contribution;
  const transformed = {
    // BASICS VALUES
    id,
    buttonSubmitted: buttonSubmitted || '',
    dateOfContribution: format(
      new Date(parseFromTimeZone(date, { timeZone: 'America/Los_Angeles' })),
      'YYYY-MM-DD'
    ),
    updatedAt: format(
      new Date(
        parseFromTimeZone(updatedAt, { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YY hh:mm a'
    ),
    typeOfContribution: type,
    subTypeOfContribution: subType,
    typeOfContributor: contributorType,
    inKindType: inKindType || '',
    oaeType: oaeType || '',
    amountOfContribution: amount.toFixed(2),
    checkNumber: checkNumber || '',

    // CONTRIBUTOR VALUES
    firstName,
    lastName,
    entityName: name || '',
    streetAddress: address1,
    addressLine2: address2,
    city,
    state,
    zipcode: zip,
    email: email || '',
    phone: phone || '',
    phoneType: phoneType || '',
    occupation: occupation || '',
    employerName: employerName || '',
    employerCity: employerCity || '',
    employerState: employerState || '',
    inKindDescription: inKindDescription || '',
    paymentMethod: paymentMethod || '',
    occupationLetterDate: occupationLetterDate
      ? format(
          new Date(
            parseFromTimeZone(occupationLetterDate, {
              timeZone: 'America/Los_Angeles',
            })
          ),
          'YYYY-MM-DD'
        )
      : '',
    status,
    notes: notes || '',
    campaignName: campaign && campaign.name ? campaign.name : null,
  };
  return transformed;
};

export const mapContributionFormToData = data => {
  const {
    streetAddress,
    amountOfContribution,
    city,
    dateOfContribution,
    addressLine2,
    firstName,
    lastName,
    entityName,
    state,
    zipcode,
    employerName,
    employerCity,
    employerState,
    occupation,
    occupationLetterDate,
    inKindDescription,
    email,
    phone,
    phoneType,
    checkNumber,
    typeOfContributor,
    subTypeOfContribution,
    typeOfContribution,
    inKindType,
    oaeType,
    paymentMethod,
    notes,
    isPerson = !!(
      typeOfContributor === ContributorTypeEnum.INDIVIDUAL ||
      typeOfContributor === ContributorTypeEnum.FAMILY
    ),
  } = data;

  const transformed = {
    city,
    firstName: isPerson && firstName ? firstName.trim() : null,
    middleInitial: '',
    lastName: isPerson && lastName.trim() ? lastName : null,
    name: entityName.trim() || null,
    state,
    occupation,
    occupationLetterDate: occupationLetterDate
      ? new Date(
          convertToTimeZone(occupationLetterDate, {
            timeZone: 'America/Los_Angeles',
          })
        ).getTime()
      : null,
    employerName,
    employerCity,
    employerState,
    checkNumber,
    contributorType: typeOfContributor,
    subType: subTypeOfContribution,
    type: typeOfContribution,
    inKindType: inKindType || null,
    oaeType,
    address1: streetAddress,
    address2: addressLine2,
    email,
    phone,
    phoneType: phoneType || null,
    amount: parseFloat(amountOfContribution),
    date: new Date(
      convertToTimeZone(dateOfContribution, { timeZone: 'America/Los_Angeles' })
    ).getTime(),
    zip: zipcode,
    inKindDescription,
    paymentMethod: paymentMethod || null,
    notes,
  };
  return transformed;
};

export const contributionsEmptyState = {
  // BASICS VALUES
  id: '',
  updatedAt: '',
  dateOfContribution: '',
  typeOfContribution: ContributionTypeEnum.CONTRIBUTION,
  subTypeOfContribution: '',
  typeOfContributor: ContributorTypeEnum.INDIVIDUAL,
  amountOfContribution: '',
  inKindType: '',
  oaeType: '',
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
  zipcode: '',
  email: '',
  phone: '',
  phoneType: '',
  occupation: '',
  employerName: '',
  employerCity: '',
  employerState: '',

  // OTHER DETAILS VALUES
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
    validation: Yup.string().required('OAE contribution type is required'),
    // 'The OAE contribution type is required',
    options: {
      values: mapToSelectOptions(DataToOaeTypeTypeFieldMap),
    },
  },
  paymentMethod: {
    label: 'Payment Method',
    section: FormSectionEnum.BASIC,
    component: SelectField,
    validation: Yup.string(),
    options: {
      values: [
        { value: PaymentMethodEnum.CASH, label: 'Cash' },
        { value: PaymentMethodEnum.CHECK, label: 'Check' },
        { value: PaymentMethodEnum.MONEY_ORDER, label: 'Money Order' },
        {
          value: PaymentMethodEnum.CREDIT_CARD_ONLINE,
          label: 'Credit Card (Online)',
        },
        {
          value: PaymentMethodEnum.CREDIT_CARD_PAPER,
          label: 'Credit Card (Paper Form)',
        },
        {
          value: PaymentMethodEnum.ETF,
          label: 'Electronic Funds Transfer',
        },
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
  // If entity selected, will require entity instead of first/last name
  lastName: {
    label: "Contributor's Last Name",
    section: FormSectionEnum.CONTRIBUTOR,
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
  entityName: {
    label: 'Entity Name',
    section: FormSectionEnum.CONTRIBUTOR,
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
    section: FormSectionEnum.CONTRIBUTOR,
    // TODO Catch error if google places lib cannot load
    //    and load <TextField> instead of <AddressLookupField ...>.
    // eslint-disable-next-line react/display-name
    component: props => (
      <AddressLookupField
        {...props.field}
        {...props}
        updateFields={{
          address: 'streetAddress',
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
    validation: Yup.string().nullable(),
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
        {
          value: InKindDescriptionTypeEnum.BROADCAST,
          label: 'Broadcast Advertising',
        },
        {
          value: InKindDescriptionTypeEnum.FUNDRAISING,
          label: 'Fundraising Event Expenses',
        },
        {
          value: InKindDescriptionTypeEnum.GENERAL_OPERATING,
          label: 'General Operating Expenses',
        },
        {
          value: InKindDescriptionTypeEnum.PRINTING,
          label: 'Literature/Brochures/Printing',
        },
        {
          value: InKindDescriptionTypeEnum.MANAGEMENT,
          label: 'Management Services',
        },
        {
          value: InKindDescriptionTypeEnum.NEWSPAPER,
          label: 'Newspaper and Other Periodical Advertising',
        },
        {
          value: InKindDescriptionTypeEnum.OTHER_AD,
          label: 'Other Advertising',
        },
        {
          value: InKindDescriptionTypeEnum.PETITION,
          label: 'Petition Circulators',
        },
        { value: InKindDescriptionTypeEnum.POSTAGE, label: 'Postage' },
        {
          value: InKindDescriptionTypeEnum.PREP_AD,
          label: 'Preparation and Production of Advertising',
        },
        {
          value: InKindDescriptionTypeEnum.POLLING,
          label: 'Surveys and Polls',
        },
        { value: InKindDescriptionTypeEnum.TRAVEL, label: 'Travel Expenses' },
        { value: InKindDescriptionTypeEnum.UTILITIES, label: 'Utilities' },
        {
          value: InKindDescriptionTypeEnum.WAGES,
          label: 'Wages/Salaries/Benefits',
        },
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
    section: FormSectionEnum.CONTRIBUTOR,
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
    paymentMethod === PaymentMethodEnum.CHECK ||
    paymentMethod === PaymentMethodEnum.MONEY_ORDER
  );

  // Default to visible
  visible.paymentMethod = true;

  // Un remark lines if payment types only show on subtype cash
  // visible.paymentMethod = !!(
  //   subTypeOfContribution === ContributionSubTypeEnum.CASH
  // );
  // OR show when not just payment type

  visible.emptyOccupationLetterDate = isEmpty(occupationLetterDate);

  visible.showEmployerSection =
    values.occupation === 'Employed' && visible.isPerson;

  visible.showInKindFields = !!inKindContributionValues.includes(
    subTypeOfContribution
  );

  visible.showOccupationLetter = !!(
    isEmpty(occupation) || occupation === 'Employed'
  );

  // These fields are conditionally required
  if (values.phone && isEmpty(values.phoneType)) {
    error.phoneType = 'Please select a phone type';
  }

  if (visible.showInKindFields) {
    visible.paymentMethod = false;
    if (isEmpty(inKindType)) error.inKindType = 'Inkind type is required';
  }

  if (visible.checkSelected && isEmpty(checkNumber)) {
    error.checkNumber =
      paymentMethod === PaymentMethodEnum.CHECK
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
    }
  }

  // Uncomment next line to view conditionally visible fields
  // console.log('Conditionally Visible', visible);
  values._visibleIf = visible;
  return error;
};
