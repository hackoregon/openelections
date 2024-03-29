// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { css, jsx } from '@emotion/core';
import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';
import SelectField from '../../Fields/SelectField';
/** @jsx jsx */

const fields = {
  name: {
    label: 'Campaign Name + Year',
    section: 'AddCampaign',
    component: TextField,
    validation: Yup.string('Enter campaign name and year').required(
      'Campaign name with year is required'
    ),
  },
  officeSought: {
    label: 'Office Sought',
    section: 'AddCampaign',
    component: SelectField,
    options: {
      values: [
        'Auditor',
        'Mayor',
        ' Councilor District 1',
        ' Councilor District 2',
        ' Councilor District 3',
        ' Councilor District 4',
      ],
      style: css`
        display: flex !important;
      `,
    },
    validation: Yup.string('Enter office sought').required(
      'Office is required'
    ),
  },
  email: {
    label: 'Email',
    section: 'AddCampaign',
    component: TextField,
    validation: Yup.string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
  },
  firstName: {
    label: 'First Name',
    section: 'AddCampaign',
    component: TextField,
    validation: Yup.string('Enter your first name').required(
      'First Name is required'
    ),
  },
  lastName: {
    label: 'Last Name',
    section: 'AddCampaign',
    component: TextField,
    validation: Yup.string('Enter your last name').required(
      'Last Name is required'
    ),
  },
};

const AddCampaignForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['AddCampaign']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default AddCampaignForm;

AddCampaignForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};
