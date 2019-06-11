import React from "react";
import * as Yup from "yup";

import Form from "../Form/Form";
// import PasswordField from "./fields/PasswordField";
import ChangePasswordConfirmNewPasswordField from "./ChangePasswordConfirmNewPasswordField";

const fields = {
  oldPassword: {
    label: "Old Password",
    component: ChangePasswordConfirmNewPasswordField,
    validation: Yup.string("What was you old password").required(
      "What was your old password"
    )
  },
  newPassword: {
    label: "New Password",
    component: ChangePasswordConfirmNewPasswordField,
    validation: Yup.string("Choose a new password").required(
      "Password is required"
    )
  },
  confirmNewPassword: {
    label: "Confirm New Password",
    component: ChangePasswordConfirmNewPasswordField,
    validation: Yup.string("Choose a new password").required(
      "Password is required"
    )
  }
};

const ChangePasswordForm = ({ initialValues, onSubmit, children }) => (
  <Form fields={fields} initialValues={initialValues} onSubmit={onSubmit}>
    {children}
  </Form>
);

export default ChangePasswordForm;
