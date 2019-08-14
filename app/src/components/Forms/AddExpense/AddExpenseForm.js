import React, { Fragment } from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import DateField from "../../Fields/DateField";
import { PayeeTypeEnum, ExpenditureSubTypeEnum, ExpenditureTypeEnum} from "../../../api/api"

const {EXPENDITURE,OTHER,OTHER_DISBURSEMENT} = ExpenditureTypeEnum
const {ACCOUNTS_PAYABLE, CASH_EXPENDITURE, PERSONAL_EXPENDITURE, ACCOUNTS_PAYABLE_RESCINDED, CASH_BALANCE_ADJUSTMENT,MISCELLANEOUS_OTHER_DISBURSEMENT, REFUND_OF_CONTRIBUTION } = ExpenditureSubTypeEnum
const expenditureTypes = [];
expenditureTypes[EXPENDITURE] = [ACCOUNTS_PAYABLE, CASH_EXPENDITURE, PERSONAL_EXPENDITURE ]
expenditureTypes[OTHER] = [ACCOUNTS_PAYABLE_RESCINDED, CASH_BALANCE_ADJUSTMENT]
expenditureTypes[OTHER_DISBURSEMENT] = [MISCELLANEOUS_OTHER_DISBURSEMENT, REFUND_OF_CONTRIBUTION]

const fields = {
  // BASICS SECTION
  amount: {
    label: "Amount of Expenditure",
    section: "sectionOne",
    component: TextField,
     validation: Yup.number("Choose the amount of expenditure")
    //   // NEEDS TO BE FORMATTED AS CURRENCY
    //   .required("The expenditure amount is required")
  },
  date: {
    label: "Date of Expenditure",
    section: "sectionOne",
    component: DateField,
    validation: Yup.date("Enter date of expenditure").required(
      // date format? validate specifically?
      "A expenditure date is required"
    )
  },
  type: {
    label: "Type of Expenditure (TODO: Pick Other Dis)",
    section: "sectionOne",
    component: SelectField,
    options: {
      values: [
        {value: ExpenditureTypeEnum.EXPENDITURE, label: 'Expenditure'},
        {value: ExpenditureTypeEnum.OTHER, label: 'Other'},
        {value: ExpenditureTypeEnum.OTHER_DISBURSEMENT, label: 'Other Disbursement'},
      ],
    //values: Object.values(ExpenditureTypeEnum),
    },
    validation: Yup.string("Choose the type of contribution").required(
      "A contribution type is required"
    )
  },
  subType: {
    label: "Subtype of Expenditure (TODO: Pick Miscellaneous )",
    section: "sectionOne",
    component: SelectField,
    options: {
      limitByField: 'type',
      limitByValues: expenditureTypes,
      valuessss: Object.values(ExpenditureSubTypeEnum),

      values: [
        {value: ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE, label: 'Accounts Payable'},
        {value: ExpenditureSubTypeEnum.ACCOUNTS_PAYABLE_RESCINDED, label: 'Accounts Payable Rescinded'},
        {value: ExpenditureSubTypeEnum.CASH_BALANCE_ADJUSTMENT, label: 'Cash Balance Adjustment'},
        {value: ExpenditureSubTypeEnum.CASH_EXPENDITURE, label: 'Cash Expenditure'},
        {value: ExpenditureSubTypeEnum.MISCELLANEOUS_OTHER_DISBURSEMENT, label: 'Miscellaneous Other Disbursement'},
        {value: ExpenditureSubTypeEnum.PERSONAL_EXPENDITURE, label: 'Personal Expenditure for Reimbursement'},
        {value: ExpenditureSubTypeEnum.REFUND_OF_CONTRIBUTION, label: 'Return or Refund of Contribution'} 
      ], 
    },
    validation: Yup.string("Choose the subtype of expenditure").required(
      "The expenditure subtype is required"
    )
  },
  paymentMethod: {
    label: "Payment Method (TODO: not in API or DB)",
    section: "sectionOne",
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
    section: "sectionOne",
    component: TextField,
    validation: Yup.number("Enter your check number").required(
      "Check number is required" // ONLY REQUIRED IF PAYMENT METHOD IS CHECK
    )
  },
  description: {
    label: "Purpose of Expenditure (TODO: Stored in DB as discription)",
    section: "sectionOne",
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

  // PAYEE SECTION
  payeeType: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Payee Type",
    section: "sectionTwo",
    component: SelectField,
    options: {
      values: Object.values(PayeeTypeEnum),
      values_display: ["Individual", "Business Entity", "Candidate"]
    },
    validation: Yup.string("Select the payee type").required(
      "The payee type is required"
    )
  },
  name: {
    // IF ENTITY SELECTED, WILL REQUIRE ENTITY INSTEAD OF FIRST/LAST NAME
    label: "Payee's Name",
    section: "sectionTwo",
    component: TextField,
    validation: Yup.string("Enter the payee's name").required(
      "The payee's name is required"
    )
  },
  address1: {
    label: "Street Address/PO Box",
    section: "sectionTwo",
    component: TextField,
    validation: Yup.string("Enter the payee's street address").required(
      "The payee's street address is required"
    )
  },
  address2: {
    label: "Address Line 2",
    section: "sectionTwo",
    component: TextField
    // NO VALIDATION BECAUSE NOT REQUIRED?
  },
  // countryRegion: {
  //   label: "Country/Region",
  //   setion: "sectionTwo",
  //   component: TextField,
  //   validation: Yup.string("Enter the payee's country or region").required(
  //     "The payee's country or region is required"
  //   )
  // },
  city: {
    label: "City",
    section: "sectionTwo",
    component: TextField,
    validation: Yup.string("Select the payee's city").required(
      "The payee's city is required"
    )
  },
  state: {
    label: "State",
    section: "sectionTwo",
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
  zip: {
    label: "Zipcode",
    section: "sectionTwo",
    component: TextField,
    validation: Yup.number("Enter your zipcode").required(
      "A zipcode is required"
    )
  },
  // county: {
  //   label: "County",
  //   setion: "sectionTwo",
  //   component: TextField,
  //   validation: Yup.string("Enter the payee's county").required(
  //     "The payee's county is required"
  //   )
  // },

  // notes: {
  //   label: "Notes",
  //   section: "sectionThree",
  //   component: TextField,
  //   validation: Yup.string("Add any additional notes")
  // }
};

const AddExpenseForm = ({ initialValues, onSubmit, children }) => (
  <React.Fragment>
    <Form
      fields={fields}
      sections={["sectionOne", "sectionTwo", "sectionThree"]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </React.Fragment>
);

export default AddExpenseForm;
