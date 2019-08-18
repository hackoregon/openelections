import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import PasswordField from '../../Fields/PasswordField';

const fields = {
  oldPassword: {
    label: 'Old Password',
    section: 'oldPassword',
    component: PasswordField,
    validation: Yup.string('What was you old password').required(
      'What was your old password'
    ),
  },
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

const ChangePasswordForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['oldPassword', 'newPassword']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ChangePasswordForm;
