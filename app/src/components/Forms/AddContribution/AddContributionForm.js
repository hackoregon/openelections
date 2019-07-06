import React from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";

const fields = {
  dateOfContribution: {
    label: "Date of Contribution",
    section: "dateOfContribution",
    component: TextField,
    validation: Yup.date("Enter date of contribution").required(
      "A contribution date is required"
    )
  },
  typeOfContribution: {
    label: "Type of Contribution",
    section: "typeOfContribution",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the type of contribution")
      .required("A contribution type is required")
  },
  subTypeOfContribution: {
    label: "Subtype of Contribution",
    section: "subTypeOfContribution",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the subtype of contribution")
      .required("The contribution subtype is required") // KELLY - is the subtype required?
  },
  typeOfContributor: {
    label: "Type of Contributor",
    section: "typeOfContributor",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the type of contributor")
      .required("A contributor type is required")
  },
  amountOfContribution: {
    label: "Amount of Contribution",
    section: "amountOfContribution",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the amount of contribution")
      .required("The contribution amount is required") 
  },
  oaeContributionType: {
    label: "OAE Contribution Type",
    section: "oaeContributionType",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the OAE contribution type")
      .required("The OAE contribution type is required") 
  },
  paymentMethod: {
    label: "Payment Method",
    section: "paymentMethod",
    component: SelectField,
    options: {
      values: ["Admin", "Staff"] // get from Redux state eventually
    },
    validation: Yup.string("Choose the payment method")
      .required("The payment method is required") 
  },
  checkNumber: {
    label: "Check Number",
    section: "checkNumber",
    component: TextField,
    validation: Yup.string("Enter your check number").required(
      "Check number is required"
    )
  }
};

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["dateOfContribution", "typeOfContribution", "subTypeOfContribution", "typeOfContributor", "amountOfContribution", "oaeContributionType", "paymentMethod", "checkNumber"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default AddContributionForm;
