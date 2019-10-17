import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Form from '../../Form/Form';
import PasswordField from '../../Fields/PasswordField';

const fields = {
  oldPassword: {
    label: 'Current Password',
    section: 'resetPassword',
    component: PasswordField,
    validation: Yup.string('Enter your current password').required(
      'Current password is required'
    ),
  },
  newPassword: {
    label: 'New Password',
    section: 'resetPassword',
    component: PasswordField,
    validation: Yup.string('Enter your new password')
      .required('New password is required')
      .min(6, 'Passwords must be 6 characters'),
  },
};

const ResetPasswordForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['resetPassword']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ResetPasswordForm;

ResetPasswordForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};
