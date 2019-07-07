import React from "react";
// import * as Yup from "yup";

import Form from "../../../Form/Form";
import TextField from '../../../Fields/TextField';


const fields = {
  invoiceNumber: {
    label: "Invoice Number",
    section: "invoiceNumber",
    component: TextField,
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  campaignName: {
    label: "Campaign Name",
    section: "campaignName",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  lastEdited: {
    label: "Last Edited",
    section: "lastEdited",
    component: TextField, // KELLY - should be a date
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  currentStatus: {
    label: "Current Status",
    section: "currentStatus",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  labelsCount: {
    label: "Labels Count",
    section: "labelsCount",
    component: TextField, // KELLY - should be a counter
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  addALabel: {
    label: "Add a Label",
    section: "addALabel",
    component: TextField, // KELLY - should be a ?
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  }
};

const HeaderSectionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["invoiceNumber", "campaignName", "lastEdited", "currentStatus", "labelsCount", "addALabel"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default HeaderSectionForm;