import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

const TextFieldCivic = ({ id, label, formik }) => (
  <TextField
    id={id}
    name={id}
    label={label}
    helperText={formik.touched[id] ? formik.errors[id] : ""}
    error={formik.touched[id] && Boolean(formik.errors[id])}
    value={formik.values[id]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    autocomplete="on"
    fullWidth
  />
);

TextFieldCivic.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

export default TextFieldCivic;
