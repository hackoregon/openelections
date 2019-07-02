import React from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";

const fields = {
  oldPassword: {
    label: "Current Password",
    section: "resetPassword",
    component: TextField,
    validation: Yup.string("Enter your current password")
        .required("Current password is required")
  },
  newPassword: {
    label: "New Password",
    section: "resetPassword",
    component: TextField,
    validation: Yup.string("Enter your new password")
        .required("New password is required")
        .min(6, "Passwords must be 6 characters")
  },
};

const ResetPasswordForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["resetPassword"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ResetPasswordForm;
