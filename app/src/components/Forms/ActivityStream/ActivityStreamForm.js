import React from 'react';
import * as Yup from 'yup';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';

const fields = {
  notes: {
    label: 'Notes',
    section: 'ActivityStream',
    component: TextField,
  },
  activityId: {
    label: 'Activity Id',
    section: 'ActivityStream',
    component: TextField,
  },
  activityType: {
    label: 'Activity Type',
    section: 'ActivityStream',
    component: TextField,
  },
  campaignId: {
    label: 'Campaign Id',
    section: 'ActivityStream',
    component: TextField,
  },
};

const ActivityStreamForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['ActivityStream']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ActivityStreamForm;
