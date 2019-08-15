import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";
import TextField from "../TextField/TextField";

const DateField = (props) => {
<<<<<<< HEAD
  const { id, label, formik } = props;
=======
  const { id, label, formik, isRequired } = props;
>>>>>>> 7a9edf7cd01fab28342d7d547d47ffdbd7325a7a

  return (
  <TextFieldMaterial
    required={isRequired}
    id={id}
    name={id}
    label={label}
    type="date"
    helperText={formik.touched[id] ? formik.errors[id] : ""}
    error={formik.touched[id] && Boolean(formik.errors[id])}
    value={formik.values[id]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    autoComplete="on"
    fullWidth
    InputLabelProps={{ shrink: true }}
    {...props}
  />
)};

DateField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

export default DateField;
