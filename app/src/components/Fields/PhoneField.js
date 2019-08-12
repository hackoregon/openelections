import React from "react";
import PropTypes from "prop-types";
import MaskedInput from 'react-text-mask'

const PhoneField = ({ id, label, formik }) => (
  <MaskedInput
    id={id}
    name={id}
    label={label}
    helperText={formik.touched[id] ? formik.errors[id] : ""}
    error={formik.touched[id] && Boolean(formik.errors[id])}
    value={formik.values[id]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    autoComplete="on"
    fullWidth
    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
/>
);

PhoneField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};

export default PhoneField;
