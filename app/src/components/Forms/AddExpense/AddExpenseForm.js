import React, { Fragment } from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import DateField from "../../Fields/DateField";

const fields = {
  // BASICS SECTION
  amount: {
    label: "Amount of Expenditure",
    section: "basicsSection",
    component: TextField,
    validation: Yup.number("Choose the amount of expenditure")
      // NEEDS TO BE FORMATTED AS CURRENCY
      .required("The expenditure amount is required")
  },
  dateOfExpenditure: {
    label: "Date of Expenditure",
    section: "basicsSection",
    component: DateField,
    validation: Yup.number("Enter date of expenditure").required(
      // date format? validate specifically?
      "A expenditure date is required"
    )
  },
  typeOfExpenditure: {
    label: "Type of Expenditure",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: ["Expenditure", "Other", "Other Disbursement"]
    },
    validation: Yup.string("Choose the type of contribution").required(
      "A contribution type is required"
    )
  },
  subTypeOfExpenditure: {
    label: "Subtype of Expenditure",
    section: "basicsSection",
    component: SelectField,
    options: {
      // If Expenditure Type is “Expenditure,” drop down says: Accounts Payable, Cash Expenditure, Personal Expenditure for Reimbursement.
      values: [
        "Accounts Payable",
        "Cash Expenditure",
        "Personal Expenditure for Reimbursement"
      ]
      // If Expenditure Type is “Other.” drop down says: Accounts Payable Rescinded, Cash Balance Adjustment (maybe)
      // values: [
      //   "Accounts Payable Rescinded", "Cash Balance Adjustment"
      // ]
      // If Expenditure Type is “Other Disbursement,” drop down says: Miscellaneous Other Disbursement, Return or Refund of Contribution.
      // values: [
      //   "Miscellaneous Other Disbursement", "Return or Refund of Contribution"
      // ]
    },
    validation: Yup.string("Choose the subtype of expenditure").required(
      "The expenditure subtype is required"
    )
  },
  paymentMethod: {
    label: "Payment Method",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: [
        "Check",
        "Credit Card",
        "Debit Card",
        "Electronic Check",
        "Electronic Funds Transfer"
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
      "Check number is required" // ONLY REQUIRED IF PAYMENT METHOD IS CHECK
    )
  },

  // CONTRIBUTOR SECTION
  payeeType: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Payee Type",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Individual", "Business Entity", "Candidate"]
    },
    validation: Yup.string("Select the payee type").required(
      "The payee type is required"
    )
  },
  payeeName: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Payee's Name",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter the payee's name").required(
      "The payee's name is required"
    )
  },
  streetAddress: {
    label: "Street Address/PO Box",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter the payee's street address").required(
      "The payee's street address is required"
    )
  },
  addressLine2: {
    label: "Address Line 2",
    section: "contributorSection",
    component: TextField
    // NO VALIDATION BECAUSE NOT REQUIRED?
  },
  countryRegion: {
    label: "Country/Region",
    setion: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter the payee's country or region").required(
      "The payee's country or region is required"
    )
  },
  city: {
    label: "City",
    section: "contributorSection",
    component: TextField,
    validation: Yup.string("Select the payee's city").required(
      "The payee's city is required"
    )
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
  county: {
    label: "County",
    setion: "contributorSection",
    component: TextField,
    validation: Yup.string("Enter the payee's county").required(
      "The payee's county is required"
    )
  },

  // OTHER DETAILS SECTION
  purposeOfExpenditure: {
    label: "Purpose of Expenditure",
    section: "otherDetailsSection",
    component: SelectField,
    options: {
      values: [
        "Broadcast Advertising",
        "Cash Contribution",
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
        "Wages/Salaries/Benefits",
        "Reimbursement for Personal Expenditures"
      ]
    },
    validation: Yup.string("Choose the purpose of the expenditure").required(
      "A description of the purpose is required"
      // REQUIRED IF: Miscellaneous Other Disbursement is selected for Sub Type.
    )
  },
  notes: {
    label: "Notes",
    section: "otherDetailsSection",
    component: TextField,
    validation: Yup.string("Add any additional notes")
  }
};

const AddExpenseForm = ({ initialValues, onSubmit, children }) => (
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

export default AddExpenseForm;
