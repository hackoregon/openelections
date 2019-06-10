import React from "react";
import TextField from "@material-ui/core/TextField";

const ChangePasswordOldPasswordField = props => (
  <TextField
    id="confirmNewPassword"
    name="confirmNewPassword"
    label="Confirm New Password"
    type="password"
    helperText={
      props.formik.touched.confirmNewPassword
        ? props.formik.errors.confirmNewPassword
        : ""
    }
    error={
      props.formik.touched.confirmNewPassword &&
      Boolean(props.formik.errors.confirmNewPassword)
    }
    value={props.formik.values.confirmNewPassword}
    onChange={props.formik.handleChange}
    onBlur={props.formik.handleBlur}
    fullWidth
  />
);

export default ChangePasswordOldPasswordField;
