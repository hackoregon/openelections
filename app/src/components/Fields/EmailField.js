import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';

import emailMask from 'text-mask-addons/dist/emailMask';

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={emailMask}
      showMask
    />
  );
}

export default function EmailField({ id, label, formik }) {
  return (
    <TextFieldMaterial
      id={id}
      name={id}
      label={label}
      helperText={formik.touched[id] ? formik.errors[id] : ''}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      value={formik.values[id]}
      onChange={formik.handleChange(id)}
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

EmailField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};
