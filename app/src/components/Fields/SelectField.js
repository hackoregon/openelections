import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
/** @jsx jsx */
import { jsx } from "@emotion/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block !important',
    padding: '5px !important'
  }
}));

const SelectField = ({ id, label, options, formik }) => {
  const classes = useStyles();
  let optionValues = options.values;

  if(options.values && !options.values[0].value){
    optionValues = options.values.map(x => ({value: x, label: x }))
  }

  if(options.limitByField){
    if(options.limitByValues){
      let includeValues = options.limitByValues[formik.values[options.limitByField]];
      optionValues = optionValues.filter(x => includeValues.indexOf(x.value) != -1);
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        value={formik.values[id]}
        onChange={formik.handleChange}
        inputProps={{
          name: id,
          id: id
        }}
        fullWidth
      >
       {optionValues.map((option, key) => (
          <MenuItem value={option.value} key={key}>
            {option.label } 
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
};

SelectField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.shape({
    limitByField: PropTypes.string,
    limitByValues: function(props, propName, componentName) {
      if (props['limitByField'] != undefined && props[propName] == undefined ){
        return new Error('limitByValues array is required when limitByField is set');
      }
    },
    values: PropTypes.array.isRequired
  }),
  formik: PropTypes.shape({})
};

export default SelectField;
