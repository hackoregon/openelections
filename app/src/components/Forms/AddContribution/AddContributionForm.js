import React, { Fragment } from "react";
import * as Yup from "yup";
import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import DateField from "../../Fields/DateField";

const FormSectionEnum = Object.freeze({
  BASIC: "basicsSection",
  CONTRIBUTOR: "contributorSection",
  OTHER_DETAILS: "otherDetailsSection"
})

const stateList = [
  "AK",
  "AL",
  "AR",
  "AS",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "GU",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "ND",
  "NC",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VI",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY"
]

const formField = (label, section, component, validation, values = undefined) =>
  values ? { label, section, component, validation, options: { values } } : { label, section, component, validation }

const requiredFormField = (label, section, component, validation, requiredMessage, values = undefined) => {
  validation = validation.required(requiredMessage)
  return values ? { label, section, component, validation, options: { values } } : { label, section, component, validation }
}

const optionalRequiredFormField = () => { }

const DynamicOptionField = ({ Component, props, check, trueOptions, falseOptions }) => (
  <Component {...props} options={check ? trueOptions : falseOptions} />
)

const fields = {
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
    ["Contribution", "Other Receipt"]
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
        trueOptions={{ values: ["Cash Contribution", "In-Kind Contribution", "In-Kind Forgiven Accounts Payable", "In-Kind /Forgiven Personal Expenditure"] }}
        falseOptions={{ values: ["Items Sold at Fair Market Value", "Lost or Returned Check", "Miscellaneous Other Receipt", "Refunds and Rebates"] }}
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
    [
      "Individual",
      "Business Entity",
      "Candidate’s Immediate Family",
      "Labor Organization",
      "Political Committee",
      "Political Party Committee",
      "Unregistered Committee",
      "Other"
    ]
  ),
  // NEEDS TO BE FORMATTED AS CURRENCY
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
  checkNumber: requiredFormField(
    "Check Number",
    FormSectionEnum.BASIC,
    TextField,
    Yup.number("Enter your check number"),
    "Check number is required",
  ),

  // CONTRIBUTOR SECTION
  firstName: requiredFormField(
    "Contributor's First Name",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your first name"),
    "Your first name is required"
  ),
  // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
  lastName: requiredFormField(
    "Contributor's Last Name",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your last name"),
    "Your last name is required"
  ),
  streetAddress: requiredFormField(
    "Street Address",
    FormSectionEnum.CONTRIBUTOR,
    TextField,
    Yup.string("Enter your street address"),
    "Your street address is required"
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
    ["Work Phone", "Extension", "Home Phone", "Fax", "Email address"] // get from Redux state eventually
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
  description: requiredFormField(
    "Description",
    FormSectionEnum.OTHER_DETAILS,
    SelectField,
    Yup.string("Choose the description of the contribution"),
    // REQUIRED IF: In-Kind Contribution, In-Kind Forgiven Accounts Payable,
    // or In-Kind Forgiven Personal Expenditure was selection.
    "A description is required",
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
  occupationLetterDate: requiredFormField(
    "Occupation Letter Date",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.date("Enter occupation letter date"),
    // NOT REQUIRED IF OCCUPATION & EMPLOYER NAME/ADDRESS FILLED IN
    "Occupation letter date is required"
  ),
  linkToDocumentation: requiredFormField(
    "Link to Documentation?",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.string("Provide a link to documentation of your contribution"),
    "A link to documentation of your contribution is required"
    // Required UNLESS the payment method is Credit Card (Online).
    // or if there is a donor portal where donors can attest digitally, that may affect this
  ),
  notes: formField(
    "Notes?",
    FormSectionEnum.OTHER_DETAILS,
    TextField,
    Yup.string("Add any additional notes")
  )
};

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  <>
    <Form
      fields={fields}
      sections={[FormSectionEnum.BASIC, FormSectionEnum.CONTRIBUTOR, FormSectionEnum.OTHER_DETAILS]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </>
);
export default AddContributionForm;
