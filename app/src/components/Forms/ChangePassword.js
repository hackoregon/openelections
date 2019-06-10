import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import * as Yup from "yup";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import ChangePasswordOldPasswordField from "./ChangePasswordOldPasswordField";
import ChangePasswordNewPasswordField from "./ChangePasswordNewPasswordField";
import ChangePasswordConfirmNewPasswordField from "./ChangePasswordConfirmNewPasswordField";

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
        onSubmit={(values, formikBag) => {
          // This is quite detailed and a work around
          // to be able to encapsulate attaching state handling
          // upon submission within the form. The details/create
          // component just `addHandlers` to it's mutation.
          const addHandlers = promise =>
            promise.then(
              result => {
                formikBag.resetForm();
                formikBag.setSubmitting(false);

                return result;
              },
              error => {
                formikBag.setSubmitting(false);
                formikBag.setErrors(error.validationErrors);

                throw error;
              }
            );

          return this.props.onSubmit(values, addHandlers);
        }}
        render={formikProps => {
          const form = (
            <React.Fragment>
              <p>
                To change your password, enter your current password and the new
                password you want to set.
              </p>
              <ChangePasswordOldPasswordField formik={formikProps} />
              <ChangePasswordNewPasswordField formik={formikProps} />
              <ChangePasswordConfirmNewPasswordField formik={formikProps} />
              <div
                css={css`
                  margintop: 30px;
                `}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={formikProps.handleReset}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!formikProps.isValid}
                  onClick={formikProps.handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </React.Fragment>
          );

          return this.props.children({
            form,
            isDirty: formikProps.dirty,
            isSubmitting: formikProps.isSubmitting,
            handleSubmit: formikProps.handleSubmit,
            handleCancel: formikProps.handleReset
          });
        }}
      />
    );
  }
}
