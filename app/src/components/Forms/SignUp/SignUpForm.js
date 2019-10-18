import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Form from '../../Form/Form';
import PasswordField from '../../Fields/PasswordField';

const fields = {
  newPassword: {
    label: 'New Password',
    section: 'newPassword',
    component: PasswordField,
    validation: Yup.string('Choose a new password').required(
      'Password is required'
    ),
  },
  confirmNewPassword: {
    label: 'Confirm New Password',
    section: 'newPassword',
    component: PasswordField,
    validation: Yup.string('Choose a new password that matches the other one')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Password confirm is required'),
  },
};

const SignupForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['newPassword', 'confirmNewPassword']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default SignupForm;

SignupForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};
