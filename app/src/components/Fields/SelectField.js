import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const SelectField = ({ id, label, valueOptions, formik }) => (
  <FormControl>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Select
      value={valueOptions[0]}
      onChange={formik.handleChange} // this may need updating
      inputProps={{
        name: id,
        id: id
      }}
      fullWidth
    >
      {valueOptions.map(role => (
        <MenuItem value={role} key={role}>
          {role}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

SelectField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  valueOptions: PropTypes.arrayOf(PropTypes.string),
  formik: PropTypes.shape({})
};

export default SelectField;
