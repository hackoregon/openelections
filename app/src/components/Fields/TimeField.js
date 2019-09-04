import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';

const TimeField = props => {
  const { id, label, formik, isRequired, onChange, picker } = props;
  const pickerProps = picker ? props : null;
  return (
    <TextFieldMaterial
      required={isRequired}
      id={id}
      name={id}
      label={label}
      type="time"
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

TimeField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

export default TimeField;
