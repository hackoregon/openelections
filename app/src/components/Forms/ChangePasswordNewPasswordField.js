import React from "react";
import TextField from "@material-ui/core/TextField";

const ChangePasswordNewPasswordField = props => (
  <TextField
    id="newPassword"
    name="newPassword"
    label="New Password"
    type="password"
    helperText={
      props.formik.touched.newPassword ? props.formik.errors.newPassword : ""
    }
    error={
      props.formik.touched.newPassword &&
      Boolean(props.formik.errors.newPassword)
    }
    value={props.formik.values.newPassword}
    onChange={props.formik.handleChange}
    fullWidth
  />
);

export default ChangePasswordNewPasswordField;
