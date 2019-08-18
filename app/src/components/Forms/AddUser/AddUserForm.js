import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';
import SelectField from '../../Fields/SelectField';

const fields = {
  userRole: {
    label: 'Role',
    section: 'addUserRole',
    options: {
      values: ['Admin', 'Staff'], // get from Redux state eventually
    },
    component: SelectField,
    validation: Yup.string('Choose a user role').required(
      'A user role is required'
    ),
  },
  email: {
    label: 'Email',
    section: 'addUser',
    component: TextField,
    validation: Yup.string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
  },
  firstName: {
    label: 'First Name',
    section: 'addUser',
    component: TextField,
    validation: Yup.string('Enter your first name').required(
      'First Name is required'
    ),
  },
  lastName: {
    label: 'Last Name',
    section: 'addUser',
    component: TextField,
    validation: Yup.string('Enter your last name').required(
      'Last Name is required'
    ),
  },
};

const AddUserForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['addUserRole', 'addUser']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default AddUserForm;
