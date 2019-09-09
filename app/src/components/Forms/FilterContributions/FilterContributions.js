import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';
import SelectField from '../../Fields/SelectField';
import DateRangeField from '../../Fields/DateRangeField';

export const STATUS_OPTIONS = {
  'All Statuses': 'all',
  Archived: 'Archived',
  Draft: 'Draft',
  Submitted: 'Submitted',
  Processed: 'Processed',
};

const ORDER_OPTIONS = {
  Descending: 'DESC',
  Ascending: 'ASC',
};

const SORT_OPTIONS = {
  // 'Campaign-Id': 'campaignId',
  Status: 'status',
  Date: 'date',
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
  // orderBy: {
  //   label: 'Order By',
  //   section: 'filter',
  //   options: {
  //     values: Object.keys(ORDER_OPTIONS).map(key => ({
  //       value: ORDER_OPTIONS[key],
  //       label: key,
  //     })),
  //   },
  //   component: SelectField,
  //   validation: Yup.string('Choose the order of the filtered response'),
  // },
  // sortBy: {
  //   label: 'Sort By',
  //   section: 'filter',
  //   options: {
  //     values: Object.keys(SORT_OPTIONS).map(key => ({
  //       value: SORT_OPTIONS[key],
  //       label: key,
  //     })),
  //   },
  //   component: SelectField,
  //   validation: Yup.string('Choose the order of the filtered response'),
  // },
  perPage: {
    label: 'Results per page',
    section: 'paginate',
    options: {
      values: ['50', '100', '150'],
    },
    component: SelectField,
    validation: Yup.string('Choose number of results per page'),
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
