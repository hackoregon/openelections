import React from "react";
import * as Yup from "yup";
import Form from "../../../Form/Form";
import TextField from '../../../Fields/TextField';
import SelectField from "../../../Fields/SelectField";


const fields = {
  dateOfContribution: {
    label: "Date of Contribution",
    section: "dateOfContribution",
    component: TextField,
    validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
      "A contribution date is required"
    )
  },
  typeOfContribution: {
    label: "Type of Contribution",
    section: "typeOfContribution",
    component: SelectField,
    options: {
      values: ["Contribution", "Other Receipt"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the type of contribution")
      .required("A contribution type is required")
  },
  subTypeOfContribution: {
    label: "Subtype of Contribution",
    section: "subTypeOfContribution",
    component: SelectField,
    options: {
      // if typeOfContribution was 'contribution' subTypes are:
      // Cash Contribution, In-Kind Contribution, In-Kind Forgiven Accounts Payable, 
      // In-Kind /Forgiven Personal Expenditure
      values: ["Cash Contribution", "In-Kind Contribution", "In-Kind Forgiven Accounts Payable",
    "In-Kind /Forgiven Personal Expenditure"] // get from Redux state eventually
    // If Other Receipt was selected, drop down says: Items Sold at Fair Market Value, 
    // Lost or Returned Check, Miscellaneous Other Receipt, Refunds and Rebates
    },
    validation: Yup.string("Choose the subtype of contribution")
      .required("The contribution subtype is required") // KELLY - is the subtype required?
  },
  typeOfContributor: {
    label: "Type of Contributor",
    section: "typeOfContributor",
    component: SelectField,
    options: {
      values: ["Individual", "Business Entity", "Candidate’s Immediate Family", 
      "Labor Organization", "Political Committee", "Political Party Committee", 
      "Unregistered Committee", "Other"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the type of contributor")
      .required("A contributor type is required")
  },
  amountOfContribution: {
    label: "Amount of Contribution",
    section: "amountOfContribution",
    component: TextField,
    validation: Yup.number("Choose the amount of contribution") // KELLY - dollar amount entry
      .required("The contribution amount is required") 
  },
  oaeContributionType: {
    label: "OAE Contribution Type",
    section: "oaeContributionType",
    component: SelectField,
    options: {
      values: ["Seed Money", "Matchable", "Public Matching Contribution", "Qualifying",
    "Allowable", "In-Kind: Paid Supervision of Volunteers", "In-Kind: Other"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the OAE contribution type")
      .required("The OAE contribution type is required") 
  },
  paymentMethod: {
    label: "Payment Method",
    section: "paymentMethod",
    component: SelectField,
    options: {
      values: ["Cash", "Check", "Money Order", "Credit Card (Online)", "Credit Card (Paper Form)"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the payment method")
      .required("The payment method is required") 
  },
  checkNumber: {
    label: "Check Number",
    section: "checkNumber",
    component: TextField,
    validation: Yup.number("Enter your check number").required(  // KELLY - numerical entry
      "Check number is required"
    )
  }
};

const BasicsSectionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["dateOfContribution", "typeOfContribution", "subTypeOfContribution", "typeOfContributor", "amountOfContribution", "oaeContributionType", "paymentMethod", "checkNumber"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default BasicsSectionForm;