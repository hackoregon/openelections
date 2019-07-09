import React, { Fragment } from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";

const fields = {
  // BASICS SECTION
  dateOfContribution: {
    label: "Date of Contribution",
    section: "basicsSection",
    component: TextField,
    validation: Yup.number("Enter date of contribution").required(
      // date format? validate specifically?
      "A contribution date is required"
    )
  },
  typeOfContribution: {
    label: "Type of Contribution",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: ["Contribution", "Other Receipt"]
    },
    validation: Yup.string("Choose the type of contribution").required(
      "A contribution type is required"
    )
  },
  subTypeOfContribution: {
    label: "Subtype of Contribution",
    section: "basicsSection",
    component: SelectField,
    options: {
      // if typeOfContribution was 'contribution' subTypes are:
      // Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable,
      // In-Kind /Forgiven Personal Expenditure
      values: [
        "Cash Contribution",
        "In-Kind Contribution",
        "In-Kind Forgiven Accounts Payable",
        "In-Kind /Forgiven Personal Expenditure"
      ] // get from Redux state eventually
      // If Other Receipt was selected, drop down says: Items Sold at Fair Market Value,
      // Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
    },
    validation: Yup.string("Choose the subtype of contribution").required(
      "The contribution subtype is required"
    )
  },
  typeOfContributor: {
    label: "Type of Contributor",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: [
        "Individual",
        "Business Entity",
        "Candidate’s Immediate Family",
        "Labor Organization",
        "Political Committee",
        "Political Party Committee",
        "Unregistered Committee",
        "Other"
      ]
    },
    validation: Yup.string("Choose the type of contributor").required(
      "A contributor type is required"
    )
  },
  amountOfContribution: {
    label: "Amount of Contribution",
    section: "basicsSection",
    component: TextField,
    validation: Yup.number("Choose the amount of contribution")
      // NEEDS TO BE FORMATTED AS CURRENCY
      .required("The contribution amount is required")
  },
  oaeContributionType: {
    label: "OAE Contribution Type",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: [
        "Seed Money",
        "Matchable",
        "Public Matching Contribution",
        "Qualifying",
        "Allowable",
        "In-Kind: Paid Supervision of Volunteers",
        "In-Kind: Other"
      ]
    },
    validation: Yup.string("Choose the OAE contribution type").required(
      "The OAE contribution type is required"
    )
  },
  paymentMethod: {
    label: "Payment Method",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: [
        "Cash",
        "Check",
        "Money Order",
        "Credit Card (Online)",
        "Credit Card (Paper Form)"
      ]
    },
    validation: Yup.string("Choose the payment method").required(
      "The payment method is required"
    )
  },
  checkNumber: {
    label: "Check Number",
    section: "basicsSection",
    component: TextField,
    validation: Yup.number("Enter your check number").required(
      "Check number is required"
    )
  },

  // CONTRIBUTOR SECTION
  firstName: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Contributor's First Name",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your first name").required(
      "Your first name is required"
    )
  },
  lastName: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Contributor's Last Name",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your last name").required(
      "Your last name is required"
    )
  },
  streetAddress: {
    label: "Street Address",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter your street address").required(
      "Your street address is required"
    )
  },
  addressLine2: {
    label: "Address Line 2",
    section: "contributorSection",
    component: TextField
    // NO VALIDATION BECAUSE NOT REQUIRED?
  },
  city: {
    label: "City",
    section: "contributorSection",
    component: TextField,

    validation: Yup.string("Select your city").required("Your city is required")
  },
  state: {
    label: "State",
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
    validation: Yup.string("Select your state").required(
      "Your state is required"
    )
  },
  zipcode: {
    label: "Zipcode",
    section: "contributorSection",
    component: TextField,
    validation: Yup.number("Enter your zipcode").required(
      "A zipcode is required"
    )
  },
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
