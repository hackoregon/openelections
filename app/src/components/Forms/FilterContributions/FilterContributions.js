import React from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import DateRangeField from "../../Fields/DateRangeField";

const fields = {
  status: {
    label: "Status",
    section: "filter",
    options: {
      values: ["All Statuses", "Archived", "Draft", "Submitted", "Processed"]
    },
    component: SelectField,
    validation: Yup.string("Choose a status").required("A status is required to filter")
  },
  range: {
    label: "Date Range",
    section: "filter",
    options: {
    },
    component: DateRangeField,
    validation: Yup.string("Choose a status").required("A status is required to filter")
  },
};

const FilterContributionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["filter"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default FilterContributionForm;
