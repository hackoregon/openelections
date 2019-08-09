import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";

<<<<<<< HEAD
<<<<<<< HEAD
const TimeField = (props) => {
    const { id, label, formik, isRequired } = props;
  return (
  <TextFieldMaterial
    required={isRequired}
=======
const DateField = ({ id, label, formik }) => (
=======
const TimeField = (props) => {
    const { id, label, formik } = props;
  return (
>>>>>>> WIP: DateRangeField
  <TextFieldMaterial
>>>>>>> Created DateRange field and added to the contributions filter
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
<<<<<<< HEAD
<<<<<<< HEAD
    {...props}
  />
)};

TimeField.propTypes = {
=======
=======
    {...props}
>>>>>>> WIP: DateRangeField
  />
)};

<<<<<<< HEAD
DateField.propTypes = {
>>>>>>> Created DateRange field and added to the contributions filter
=======
TimeField.propTypes = {
>>>>>>> WIP: DateRangeField
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

<<<<<<< HEAD
<<<<<<< HEAD
export default TimeField;
=======
export default DateField;
>>>>>>> Created DateRange field and added to the contributions filter
=======
export default TimeField;
>>>>>>> WIP: DateRangeField
