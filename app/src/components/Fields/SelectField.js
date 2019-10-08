import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { isEmpty } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 *
 * If a simple array, ['OR','WA','CA'], is passed to options.values
 * then the value and label will be set the same. To specify a differnt
 * label and value use the following format.
 *
 *  usStates:{
 *   option: {
 *     values: [
 *       {value: "OR", label: "Oregon State"},
 *       {value: 'WA', label: 'Washington State'},
 *     ],
 *   }
 *  }
 *  usCities:{
 *   option: {
 *     limitByField: "usaState",       //Dynamic options based on the usStates field
 *     limitByValues:{
 *       "OR":["portland", "salem"],  //When 'OR' is selected in state show these options
 *       "WA":["vancouver", "seattle"]
 *
 *     }
 *     values: [
 *       {value: "portland", label: "Portland"},
 *       {value: "vancouver", label: "Vancouver"},
 *       {value: "seatte", label: "Seattle"},
 *       {value: "salem", label: "Salem"},
 *     ],
 *   }
 *  }
 *
 */

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block !important',
    padding: '5px !important',
  },
}));

const SelectField = ({ id, label, options, formik, isRequired }) => {
  const classes = useStyles();
  let optionValues = options.values;

  if (options.values && !options.values[0].value) {
    optionValues = options.values.map(x => ({ value: x, label: x }));
  }
  if (
    options.limitByField &&
    options.limitByValues &&
    !isEmpty(formik.values[options.limitByField])
  ) {
    const includeValues =
      options.limitByValues[formik.values[options.limitByField]];
    optionValues = optionValues.filter(
      x => includeValues.indexOf(x.value) !== -1
    );
  }
  return (
    <TextField
      required={isRequired}
      select
      SelectProps={{
        native: true,
      }}
      InputLabelProps={{ shrink: true }}
      id={id}
      label={label}
      helperText={formik.touched[id] ? formik.errors[id] : ''}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      value={formik.values[id] || ''}
      onChange={formik.handleChange}
      onBlur={() => {
        formik.touched[id] = true;
        formik.handleBlur(id);
      }}
      inputProps={{
        name: id,
        id,
      }}
      fullWidth
    >
      <option value="" key="" disabled>
        Select option
      </option>
      {optionValues.map((option, key) => (
        <option value={option.value} key={key} className={classes.root}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
};

SelectField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.shape({
    limitByField: PropTypes.string,
    limitByValues(props, propName, componentName) {
      if (props.limitByField !== undefined && props[propName] === undefined) {
        return new Error(
          'limitByValues array is required when limitByField is set'
        );
      }
    },
    values: PropTypes.array,
  }),
  formik: PropTypes.shape({}),
};

export default SelectField;
