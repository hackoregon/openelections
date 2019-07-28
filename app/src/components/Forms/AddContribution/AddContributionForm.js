import React, { Fragment } from "react";
import * as Yup from "yup";
import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import DateField from "../../Fields/DateField";

const FormSectionEnum = Object.freeze({
  BASIC: "basicsSection",
  CONTRIBUTOR: "contributorSection"
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
  values ? { label, section, component, validation } : { label, section, component, validation, options: { values } }

const requiredFormField = (label, section, component, validation, requiredMessage, values = undefined) => {
  const required = validation.required(requiredMessage)
  return values ? { label, section, component, required, options: { values } } : { label, section, component, required }
}

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
  subTypeOfContribution: requiredFormField(
    "Subtype of Contribution",
    FormSectionEnum.BASIC,
    SelectField,
    Yup.string("Choose the subtype of contribution"),
    "The contribution subtype is required",
    // if typeOfContribution was 'contribution' subTypes are:
    // Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable, In-Kind /Forgiven Personal Expenditure
    ["Cash Contribution", "In-Kind Contribution", "In-Kind Forgiven Accounts Payable", "In-Kind /Forgiven Personal Expenditure"]
    // If Other Receipt was selected, drop down says: 
    // Items Sold at Fair Market Value, Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
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
  contactType: {
    label: "Contact Type",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Work Phone", "Extension", "Home Phone", "Fax", "Email address"] // get from Redux state eventually
    },
    validation: Yup.string("Select the best way to contact you")
  },
  contactInformation: {
    label: "Contact Information",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your contact information")
  },
  occupation: {
    label: "Occupation",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Not Employed", "Self Employed", "Other"]
    },
    validation: Yup.string("Select your occupation")
    // If "Other" selected, provide option to write free form text
  },
  employerName: {
    label: "Employer's Name",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your employer's name")
  },
  employerCity: {
    label: "Employer City",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your employer's city")
  },
  employerState: {
    label: "Employer State",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: [
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
    },
    validation: Yup.string("Enter your employer's state")
  },
  employerZipcode: {
    label: "Employer Zipcode",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your employer's zipcode")
  },

  // OTHER DETAILS SECTION
  electionAggregate: {
    label: "Election Aggregate",
    section: "otherDetailsSection",
    component: TextField,
    validation: Yup.number("?????").required("????? is required")
  },
  description: {
    label: "Description",
    section: "otherDetailsSection",
    component: SelectField,
    options: {
      values: [
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
    },
    validation: Yup.string(
      "Choose the description of the contribution"
    ).required(
      "A description is required"
      // REQUIRED IF: In-Kind Contribution, In-Kind Forgiven Accounts Payable,
      // or In-Kind Forgiven Personal Expenditure was selection.
    )
  },
  occupationLetterDate: {
    label: "Occupation Letter Date",
    section: "otherDetailsSection",
    component: TextField,
    validation: Yup.date("???").required("Occupation letter date is required") // NOT REQUIRED IF OCCUPATION & EMPLOYER NAME/ADDRESS FILLED IN
  },
  linkToDocumentation: {
    label: "Link to Documentation?",
    section: "otherDetailsSection",
    component: TextField,
    validation: Yup.string(
      "Provide a link to documentation of your contribution"
    ).required("A link to documentation of your contribution is required")
    // Required UNLESS the payment method is Credit Card (Online).
    // or if there is a donor portal where donors can attest digitally, that may affect this
  },
  notes: {
    label: "Notes?",
    section: "otherDetailsSection",
    component: TextField,
    validation: Yup.string("Add any additional notes")
  }
};

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  <React.Fragment>
    <Form
      fields={fields}
      sections={["basicsSection", "contributorSection", "otherDetailsSection"]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </React.Fragment>
);

export default AddContributionForm;
