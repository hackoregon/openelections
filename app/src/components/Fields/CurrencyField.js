import React from "react";
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";
// import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import NumberFormat from 'react-number-format';

// const numberMask = createNumberMask({
//     prefix: '',
//     suffix: ' $' // This will put the dollar sign at the end, with a space.
//   })

//   console.log(numberMask)

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
      />
    );
  }
  
  NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };


export default function CurrencyField ({ id, label, formik }) { 
    const [values, setValues] = React.useState({
        numberformat: formik.values[id],
      });
    
      const handleChange = name => event => {
        setValues({
          ...values,
          [name]: event.target.value,
        });
      };
    
      return (
            <TextFieldMaterial
                id={id}
                name={id}
                label={label}
                helperText={formik.touched[id] ? formik.errors[id] : ""}
                error={formik.touched[id] && Boolean(formik.errors[id])}
                value={values.numberformat}
                onChange={handleChange('numberformat')}
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
