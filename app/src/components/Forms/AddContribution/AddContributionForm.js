import React, { Fragment } from "react";
// import * as Yup from "yup";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";

const fields = {
  // HEADER SECTION
  invoiceNumber: {
    label: "Invoice Number",
    section: "headerSection",
    component: TextField,
    fullWidth: false
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  campaignName: {
    label: "Campaign Name",
    section: "headerSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  lastEdited: {
    label: "Last Edited",
    section: "headerSection",
    component: TextField // KELLY - should be a date
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  currentStatus: {
    label: "Current Status",
    section: "headerSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  labelsCount: {
    label: "Labels Count",
    section: "headerSection",
    component: TextField // KELLY - should be a counter
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  addALabel: {
    label: "Add a Label",
    section: "headerSection",
    component: TextField // KELLY - should be a ?
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  // BASICS SECTION
  dateOfContribution: {
    label: "Date of Contribution",
    section: "basicsSection",
    component: TextField,
    validation: Yup.string("Enter date of contribution").required(
      // KELLY- change to date validation
      "A contribution date is required"
    )
  },
  typeOfContribution: {
    label: "Type of Contribution",
    section: "basicsSection",
    component: SelectField,
    options: {
      values: ["Contribution", "Other Receipt"] // get from Redux state eventually
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
      ] // get from Redux state eventually
    },
    validation: Yup.string("Choose the type of contributor").required(
      "A contributor type is required"
    )
  },
  amountOfContribution: {
    label: "Amount of Contribution",
    section: "basicsSection",
    component: TextField,
    validation: Yup.number("Choose the amount of contribution") // KELLY - dollar amount entry
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
      ] // get from Redux state eventually
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
      ] // get from Redux state eventually
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
      // KELLY - numerical entry
      "Check number is required"
    )
  },
  // CONTRIBUTOR SECTION
  firstName: {
    label: "Contributor's First Name",
    section: "contributorSection",
    component: TextField
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  lastName: {
    label: "Contributor's Last Name",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  streetAddress: {
    label: "Street Address",
    section: "contributorSection",
    component: TextField // KELLY - should be a date
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  addressLine2: {
    label: "Address Line 2",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  city: {
    label: "City",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    }
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  state: {
    label: "State",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    }
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  zipcode: {
    label: "Zipcode",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  contactType: {
    label: "Contact Type",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    }
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  contactInformation: {
    label: "Contact Information",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  // KELLY - add occupation, employer's name, city, state, zipcode ////////////////
  occupation: {
    label: "Occupation",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  employerName: {
    label: "Employer's Name",
    section: "contributorSection",
    component: TextField // KELLY - should be a date
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  employerCity: {
    label: "City",
    section: "contributorSection", // KELLY - am I correct that city is the address for the employer?
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    }
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  employerState: {
    label: "State",
    section: "contributorSection",
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    }
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  employerZipcode: {
    label: "Zipcode",
    section: "contributorSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },

  // OTHER DETAILS SECTION
  electionAggregate: {
    label: "Election Aggregate",
    section: "otherDetailsSection",
    component: TextField
    // validation: Yup.string("Enter date of contribution").required( // KELLY- change to date validation
    //   "A contribution date is required")
  },
  description: {
    label: "Description",
    section: "otherDetailsSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  occupationLetterDate: {
    label: "Street Address",
    section: "otherDetailsSection",
    component: TextField // KELLY - should be a date
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  linkToDocumentation: {
    label: "Link to Documentation?",
    section: "otherDetailsSection",
    component: SelectField,
    options: {
      values: ["Not", "Sure", "What", "Will", "Fill"] // get from Redux state eventually
    } //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  },
  notes: {
    label: "Notes?",
    section: "otherDetailsSection",
    component: TextField
    //   validation: Yup.string("Choose the type of contribution")
    //     .required("A contribution type is required")
  }
};

const invoiceNumber = "#123456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "draft";
const labelsCount = 0;
const addALabel = "";

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  // SHOULD HAVE A SEPARATE HEADER COMPONENT HERE
  // that contains all the fields currently in headerSection
  <React.Fragment>
    <p>{invoiceNumber}</p>
    <p>{` ${campaignName} Campaign`}</p>
    <p>{`Last Edited ${lastEdited}`}</p>
    <p>{`Current Status ${currentStatus}`}</p>
    <p>{`labels ${labelsCount}`}</p>
    <p>{`+ Add Labels ${addALabel}`}</p>

    <Form
      fields={fields}
      sections={[
        "headerSection",
        "basicsSection",
        "contributorSection",
        "otherDetailsSection"
      ]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </React.Fragment>
);

export default AddContributionForm;
