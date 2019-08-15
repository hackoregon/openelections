import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";

const TimeField = (props) => {
<<<<<<< HEAD
    const { id, label, formik } = props;
  return (
  <TextFieldMaterial
=======
    const { id, label, formik, isRequired } = props;
  return (
  <TextFieldMaterial
    required={isRequired}
>>>>>>> 7a9edf7cd01fab28342d7d547d47ffdbd7325a7a
    id={id}
    name={id}
    label={label}
    type="time"
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

TimeField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

export default TimeField;
