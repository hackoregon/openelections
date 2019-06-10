import React from "react";
import TextField from "@material-ui/core/TextField";

const ChangePasswordOldPasswordField = props => (
  <TextField
    id="oldPassword"
    name="oldPassword"
    label="Old Password"
    type="password"
    autoComplete="current-password"
    helperText={
      props.formik.touched.oldPassword ? props.formik.errors.oldPassword : ""
    }
    error={
      props.formik.touched.oldPassword &&
      Boolean(props.formik.errors.oldPassword)
    }
    value={props.formik.values.oldPassword}
    onChange={props.formik.handleChange}
    fullWidth
  />
);

export default ChangePasswordOldPasswordField;
