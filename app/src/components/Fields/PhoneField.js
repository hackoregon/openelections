import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";
import MaskedInput from 'react-text-mask'

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      />
    );
  }

export default function PhoneField({ id, label, formik }) {
    const [values, setValues] = React.useState({
        textmask: formik.values[id],

      });

      const handleChange = name => event => {
        setValues({
          ...values,
          [name]: event.target.value,
        });
      };

      return(
        <TextFieldMaterial
            id={id}
            name={id}
            label={label}
            helperText={formik.touched[id] ? formik.errors[id] : ""}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            value={values.textmask}
            onChange={handleChange('textmask')}
            onBlur={formik.handleBlur}
            autoComplete="on"
            fullWidth
            InputProps={{
                inputComponent: TextMaskCustom,
            }}
        />
    )
}

PhoneField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({})
};