import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block !important',
    padding: '5px !important'
  }
}));

const SelectField = ({ id, label, options, formik }) => {
  const classes = useStyles();
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
        {options.values.map(role => (
          <MenuItem value={role} key={role} className={classes.root}>
            {role}
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
    values: PropTypes.arrayOf(PropTypes.string)
  }),
  formik: PropTypes.shape({})
};

export default SelectField;
