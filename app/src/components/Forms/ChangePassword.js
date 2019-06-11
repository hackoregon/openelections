import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

import ChangePasswordOldPasswordField from "./ChangePasswordOldPasswordField";
import ChangePasswordNewPasswordField from "./ChangePasswordNewPasswordField";
import ChangePasswordConfirmNewPasswordField from "./ChangePasswordConfirmNewPasswordField";
import { submitHandler } from "./utils";

const validationSchema = Yup.object({
  oldPassword: Yup.string("What was you old password").required(
    "What was your old password"
  ),
  newPassword: Yup.string("Choose a new password").required(
    "Password is required"
  ),
  confirmNewPassword: Yup.string(
    "Choose a new password that matches the other one"
  )
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Password confirm is required")
});

export class ChangePasswordForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      oldPassword: PropTypes.string,
      newPassword: PropTypes.string,
      confirmNewPassword: PropTypes.string
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };

  render() {
    return (
      <Formik
        initialValues={this.props.initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        render={formikProps => {
          const form = (
            <React.Fragment>
              <ChangePasswordOldPasswordField formik={formikProps} />
              <ChangePasswordNewPasswordField formik={formikProps} />
              <ChangePasswordConfirmNewPasswordField formik={formikProps} />
            </React.Fragment>
          );

          return this.props.children({
            form,
            isValid: formikProps.isValid,
            // isDirty: formikProps.dirty,
            // isSubmitting: formikProps.isSubmitting,
            handleSubmit: formikProps.handleSubmit,
            handleCancel: formikProps.handleReset
          });
        }}
      />
    );
  }
}
