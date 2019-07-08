import React from "react";
// import * as Yup from "yup";

import Form from "../../../Form/Form";
import TextField from '../../../Fields/TextField';
import SelectField from '../../../Fields/SelectField';

const fields = {
  firstName: {
    label: "Contributor's First Name",
    section: "firstName",
    component: TextField,
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  lastName: {
    label: "Contributor's Last Name",
    section: "lastName",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  streetAddress: {
    label: "Street Address",
    section: "streetAddress",
    component: TextField, // KELLY - should be a date
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  addressLine2: {
    label: "Address Line 2",
    section: "addressLine2",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  city: {
    label: "City",
    section: "city",
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  state: {
    label: "State",
    section: "state",
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  zipcode: {
    label: "Zipcode",
    section: "zipcode",
    component: TextField, 
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  contactType: {
    label: "Contact Type",
    section: "contactType",
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  contactInformation: {
    label: "Contact Information",
    section: "contactInformation",
    component: TextField, 
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  // KELLY - add occupation, employer's name, city, state, zipcode ////////////////
  occupation: {
    label: "Occupation",
    section: "occupation",
    component: TextField,
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  employerName: {
    label: "Employer's Name",
    section: "employerName",
    component: TextField, // KELLY - should be a date
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  employerCity: {
    label: "City",
    section: "employerCity", // KELLY - am I correct that city is the address for the employer?
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  employerState: {
    label: "State",
    section: "employerState",
    component: SelectField, 
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"
      ] // get from Redux state eventually
    },
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
  employerZipcode: {
    label: "Zipcode",
    section: "employerZipcode",
    component: TextField, 
  //   validation: Yup.string("Choose the type of contribution")
  //     .required("A contribution type is required")
  },
};

const ContributorSectionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["firstName", "lastName", "streetAddress", "addressLine2", "city", 
    "state", "zipcode", "contactType", "contactInformation", "occupation", 
    "employerName", "employerCity", "employerState", "employerZipcode"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ContributorSectionForm;