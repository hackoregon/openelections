import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../TextField/TextField';

const PasswordField = ({ id, label, formik, isRequired }) => (
  <TextField
    required={isRequired}
    id={id}
    name={id}
    label={label}
    type="password"
    helperText={formik.touched[id] ? formik.errors[id] : ''}
    error={formik.touched[id] && Boolean(formik.errors[id])}
    value={formik.values[id] || ''}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    fullWidth
  />
);

PasswordField.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

export default PasswordField;
