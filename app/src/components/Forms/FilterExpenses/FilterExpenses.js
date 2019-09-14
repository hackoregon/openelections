import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import SelectField from '../../Fields/SelectField';
import DateRangeField from '../../Fields/DateRangeField';

export const STATUS_OPTIONS = {
  'All Statuses': 'all',
  Archived: 'archived',
  Draft: 'draft',
  Submitted: 'submitted',
  'Out of Compliance': 'out_of_compliance',
  'In Compliance': 'in_compliance',
};

const fields = {
  status: {
    label: 'Status',
    section: 'filter',
    options: {
      values: Object.keys(STATUS_OPTIONS).map(key => ({
        value: STATUS_OPTIONS[key],
        label: key,
      })),
    },
    component: SelectField,
    validation: Yup.string('Choose a status'),
  },
  range: {
    label: 'Date Range',
    section: 'filter',
    options: {},
    component: DateRangeField,
    validation: Yup.mixed().test(
      'is-valid-range',
      'Range is not valid',
      value => {
        if (value.from && value.to) {
          if (Date.parse(value.from) > Date.parse(value.to)) {
            return false;
          }
        }
        return true;
      }
    ),
  },
};

const FilterContributionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['filter', 'paginate']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default FilterContributionForm;
