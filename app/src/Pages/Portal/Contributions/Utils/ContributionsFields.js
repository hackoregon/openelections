import React from "react";
import * as Yup from "yup";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import {
    requiredFormField,
    DynamicOptionField,
    formField,
    stateList,
    checkNoEmptyString
} from '../../../../components/Forms/Utils/FormsUtils';
import DateField from '../../../../components/Fields/DateField';
import SelectField from '../../../../components/Fields/SelectField';
import TextField from '../../../../components/Fields/TextField';
import AddressLookupField from '../../../../components/Fields/AddressLookupField';
import {
    ContributorTypeFieldEnum,
    ContributionSubTypeFieldEnum,
    ContactTypeFieldEnum,
    ContributionTypeFieldEnum
} from '../../../../api/api';

export const FormSectionEnum = Object.freeze({
  BASIC: "basicsSection",
  CONTRIBUTOR: "contributorSection",
  OTHER_DETAILS: "otherDetailsSection"
})

const entityContributorValues = [
  ContributorTypeFieldEnum.BUSINESS_ENTITY,
  ContributorTypeFieldEnum.LABOR_ORGANIZATION,
  ContributorTypeFieldEnum.POLITICAL_COMMITTEE,
  ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE,
  ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE
]

const individualContributorValues = [
  ContributorTypeFieldEnum.INDIVIDUAL,
  ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY,
  ContributorTypeFieldEnum.OTHER
]

const inKindContributionValues = [
  ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION,
  ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT,
  ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL
]

export const fields = {
  // BASICS SECTION
  dateOfContribution: requiredFormField(
    "Date of Contribution",
    FormSectionEnum.BASIC,
    DateField,
    Yup.string("Enter data of contribution"),
    "Contribution date is required"
  ),
  typeOfContribution: requiredFormField(
    "Type of Contribution",
    FormSectionEnum.BASIC,
    SelectField,
    Yup.string("Choose the type of contribution"),
    "A contribution type is required",
    [ContributionTypeFieldEnum.CONTRIBUTION, ContributionTypeFieldEnum.OTHER]
  ),
  // if typeOfContribution was 'contribution' subTypes are:
  //  - Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable, In-Kind /Forgiven Personal Expenditure
  // If Other Receipt was selected, drop down says: 
  //  -  Items Sold at Fair Market Value, Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
  subTypeOfContribution: requiredFormField(
    "Subtype of Contribution",
    FormSectionEnum.BASIC,
    (props) => (
      <DynamicOptionField
        Component={SelectField}
        props={props}
        check={props.formik.values.typeOfContribution === 'Contribution'}
        trueOptions={{ values: inKindContributionValues.concat([ContributionSubTypeFieldEnum.CASH_CONTRIBUTION]) }}
        falseOptions={{ values: [
          ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET, 
          ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK,
          ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT,
          ContributionSubTypeFieldEnum.REFUND_REBATES
        ] }}
      />
    ),
    Yup.string("Choose the subtype of contribution"),
    "The contribution subtype is required"
  ),
  typeOfContributor: requiredFormField(
    "Type of Contributor",
    FormSectionEnum.BASIC,
    SelectField,
    Yup.string("Choose the type of contributor"),
    "A contributor type is required",
    individualContributorValues.concat(entityContributorValues)
  ),
  // TODO: Needs to be formatted as currency
  amountOfContribution: requiredFormField(
    "Amount of Contribution",
    FormSectionEnum.BASIC,
    TextField,
    Yup.number("Choose the amount of contribution"),
    "The contribution amount is required"
  ),
  oaeContributionType: requiredFormField(
    "OAE Contribution Type",
    FormSectionEnum.BASIC,
    SelectField,
    Yup.string("Choose the OAE contribution type"),
    "The OAE contribution type is required",
    [
      "Seed Money",
      "Matchable",
      "Public Matching Contribution",
      "Qualifying",
      "Allowable",
      "In-Kind: Paid Supervision of Volunteers",
      "In-Kind: Other"
    ]
  ),
  paymentMethod: requiredFormField(
    "Payment Method",
    FormSectionEnum.BASIC,
    SelectField,
    Yup.string("Choose the payment method"),
    "The payment method is required",
    [
      "Cash",
      "Check",
      "Money Order",
      "Credit Card (Online)",
      "Credit Card (Paper Form)"
    ]
  ),
  checkNumber: formField(
    "Check Number",
    FormSectionEnum.BASIC,
    TextField,
    Yup.number("Enter your check number")
  ),

  // CONTRIBUTOR SECTION
  firstName: formField(
    "Contributor's First Name",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter first name")
  ),
  // If entity selected, will require entity instead of first/last name
  lastNameOrEntity: formField(
    "Contributor's Last Name / Entity Name",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter last name or entity name")
  ),
  streetAddress: formField(
    "Street Address",
    FormSectionEnum.CONTRIBUTOR,
    (props) =>
      <AddressLookupField
        {...props.field} {...props}
        updateFields={{
          street: "streetAddress",
          stateShort: "state",
          city: "city",
          zipCode: "zipcode"
        }}
      />,
  ),
  addressLine2: formField(
    "Address Line 2",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter second address line")
  ),
  city: requiredFormField(
    "City",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Select your city"),
    "Your city is required"
  ),
  state: requiredFormField(
    "State",
    FormSectionEnum.CONTRIBUTOR,
    SelectField,
    Yup.string("Select your state"),
    "Your state is required",
    stateList
  ),
  zipcode: requiredFormField(
    "Zip Code",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.number("Enter your zipcode"),
    "A zipcode is required"
  ),
  contactType: formField(
    "Contact Type",
    FormSectionEnum.CONTRIBUTOR,
    SelectField,
    Yup.string("Select the best way to contact you"),
    [
      ContactTypeFieldEnum.MOBILE_PHONE,
      ContactTypeFieldEnum.WORK_PHONE, 
      ContactTypeFieldEnum.EXTENSION,
      ContactTypeFieldEnum.HOME_PHONE,
      ContactTypeFieldEnum.FAX,
      ContactTypeFieldEnum.EMAIL
    ]
  ),
  contactInformation: formField(
    "Contact Information",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your contact information")
  ),
  occupation: formField(
    "Occupation",
    FormSectionEnum.CONTRIBUTOR,
    SelectField,
    Yup.string("Select your occupation"),
    ["Not Employed", "Self Employed", "Other"]
  ),
  employerName: formField(
    "Employer's Name",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your employer's name")
  ),
  employerCity: formField(
    "Employer City",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your employer's city")
  ),
  employerState: formField(
    "Employer State",
    FormSectionEnum.CONTRIBUTOR,
    SelectField,
    Yup.string("Enter your employer's state"),
    stateList
  ),
  employerZipcode: formField(
    "Employer Zip Code",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your employer's zipcode")
  ),

  // OTHER DETAILS SECTION
  electionAggregate: requiredFormField(
    "Election Aggregate",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.number("Enter your election aggregate"),
    "Election aggregate is required"
  ),
  // REQUIRED IF: In-Kind Contribution, In-Kind Forgiven Accounts Payable,
  // or In-Kind Forgiven Personal Expenditure was selection.
  description: formField(
    "Description",
    FormSectionEnum.OTHER_DETAILS,
    SelectField,
    Yup.string("Choose the description of the contribution"),
    [
      "Broadcast Advertising",
      "Fundraising Event Expenses",
      "General Operating Expenses",
      "Literature/Brochures/Printing",
      "Management Services",
      "Newspaper and Other Periodical Advertising",
      "Other Advertising",
      "Petition Circulators",
      "Postage",
      "Preparation and Production of Advertising",
      "Surveys and Polls",
      "Travel Expenses",
      "Utilities",
      "Wages/Salaries/Benefits"
    ]
  ),
  // Not required if occupation & employer name/address filled in
  occupationLetterDate: formField(
    "Occupation Letter Date",
    FormSectionEnum.OTHER_DETAILS,
    DateField,
    Yup.date("Enter occupation letter date")
  ),
  // Required UNLESS the payment method is Credit Card (Online).
  // or if there is a donor portal where donors can attest digitally, that may affect this
  linkToDocumentation: formField(
    "Link to Documentation?",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.string("Provide a link to documentation of your contribution")
  ),
  notes: formField(
    "Notes?",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.string("Add any additional notes")
  )
};

export const validate = (values) => {
  const {
    paymentMethod,
    linkToDocumentation,
    occupation,
    employerName,
    employerCity,
    employerState,
    employerZipcode,
    subTypeOfContribution,
    description,
    lastNameOrEntity,
    firstName,
    typeOfContributor
  } = values
  const error = {}

  if (checkNoEmptyString(paymentMethod) && paymentMethod !== "Credit Card (Online)" && !checkNoEmptyString(linkToDocumentation)) {
    error.linkToDocumentation = "A link to documentation of your contribution is required"
  }

  if (!checkNoEmptyString(occupation, employerCity, employerName, employerState, employerZipcode)) {
    error.occupationLetterDate = "Occupation letter date is required"
  }

  if (inKindContributionValues.includes(subTypeOfContribution) && !checkNoEmptyString(description)) {
    error.description = "A description is required"
  }

  if (entityContributorValues.includes(typeOfContributor) && !checkNoEmptyString(lastNameOrEntity)) {
    error.lastNameOrEntity = "Name of entity is required"
  }

  if (individualContributorValues.includes(typeOfContributor)) {
    if (!checkNoEmptyString(firstName)) {
      error.firstName = "First name is required."
    }

    if (!checkNoEmptyString(lastNameOrEntity)) {
      error.lastNameOrEntity = "Last name is required."
    }
  }

  return error
}