import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';
import PasswordField from '../../Fields/PasswordField';

const fields = {
  email: {
    label: 'Email',
    section: 'signIn',
    component: TextField,
    validation: Yup.string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
  },
  password: {
    label: 'Password',
    section: 'signIn',
    component: PasswordField,
    validation: Yup.string('Enter your password').required(
      'Password is required'
    ),
  },
};

const SignInForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['signIn']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default SignInForm;

SignInForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};
