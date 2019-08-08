import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";

<<<<<<< HEAD
const TimeField = (props) => {
    const { id, label, formik, isRequired } = props;
  return (
  <TextFieldMaterial
    required={isRequired}
=======
const DateField = ({ id, label, formik }) => (
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
    {...props}
  />
)};

TimeField.propTypes = {
=======
  />
);

DateField.propTypes = {
>>>>>>> Created DateRange field and added to the contributions filter
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

<<<<<<< HEAD
export default TimeField;
=======
export default DateField;
>>>>>>> Created DateRange field and added to the contributions filter
