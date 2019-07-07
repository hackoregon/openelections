import React from "react";
// import * as Yup from "yup";

import Form from "../../../Form/Form";
import TextField from '../../../Fields/TextField';
import SelectField from '../../../Fields/SelectField';

const fields = {
  electionAggregate: {
    label: "Election Aggregate",
    section: "electionAggregate",
    component: TextField,
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  description: {
    label: "Description",
    section: "description",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  occupationLetterDate: {
    label: "Street Address",
    section: "occupationLetterDate",
    component: TextField, // KELLY - should be a date
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  linkToDocumentation: {
    label: "Link to Documentation?",
    section: "linkToDocumentation",
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  notes: {
    label: "Notes?",
    section: "notes",
    component: TextField, 
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  }
};

const OtherDetailsSectionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["electionAggregate", "description", "occupationLetterDate", "linkToDocumentation", "notes"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default OtherDetailsSectionForm;