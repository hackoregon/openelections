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
    validation: Yup.string("Choose a status")
  },
  range: {
    label: "Date Range",
    section: "filter",
    options: {
    },
    component: DateRangeField,
    validation: Yup.object().test('is-valid-range', 'Range is not valid', async (value) => {
      if ( value.from.date && value.to.date) {
        if (Date.parse(value.from.date) <= Date.parse(value.to.date)) {
          return true
        }
      }
      return false;
    }).required('Bitch'),
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
