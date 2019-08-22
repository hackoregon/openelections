import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';
import TextField from '../TextField/TextField';

const DateField = props => {
  const { id, label, formik, isrequired, onChange, picker } = props;
  const pickerProps = picker ? props : null;
  return (
    <TextFieldMaterial
      required={isrequired}
      id={id}
      name={id}
      label={label}
      type="date"
      helperText={formik.touched[id] ? formik.errors[id] : ''}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      value={formik.values[id]}
      onChange={onChange || formik.handleChange}
      onBlur={formik.handleBlur}
      autoComplete="on"
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...pickerProps}
    />
  );
};

DateField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

export default DateField;
