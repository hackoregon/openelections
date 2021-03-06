import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';

const FieldValue = ({ id, label, formik, isRequired }) => (
  <TextFieldMaterial
    required={isRequired}
    id={id}
    name={id}
    label={label}
    helperText={formik.touched[id] ? formik.errors[id] : ''}
    error={formik.touched[id] && Boolean(formik.errors[id])}
    value={formik.values[id]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    autoComplete="on"
    fullWidth
    InputProps={{
      disableUnderline: true,
    }}
  />
);

FieldValue.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

export default FieldValue;
