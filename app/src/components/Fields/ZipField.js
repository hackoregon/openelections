import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      guide
      mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
    />
  );
}

export default function ZipField({ id, label, formik, isRequired }) {
  return (
    <TextFieldMaterial
      id={id}
      required={isRequired}
      name={id}
      label={label}
      helperText={formik.touched[id] ? formik.errors[id] : ''}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      value={formik.values[id] || ''}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      autoComplete="on"
      fullWidth
      InputProps={{
        inputComponent: TextMaskCustom,
      }}
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ZipField.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};
