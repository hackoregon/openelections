import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        prefix="$"
        decimalScale="2"
      />
    );
  }
  
  NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };


export default function CurrencyField ({ id, label, formik }) { 
    
      return (
            <TextFieldMaterial
                id={id}
                name={id}
                label={label}
                helperText={formik.touched[id] ? formik.errors[id] : ""}
                error={formik.touched[id] && Boolean(formik.errors[id])}
                value={formik.values[id]}
                onChange={formik.handleChange(id)}
                onBlur={formik.handleBlur}
                autoComplete="on"
                fullWidth
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
            />
            );
}

CurrencyField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};
