import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
/** @jsx jsx */
import { jsx } from "@emotion/core";

const SelectField = ({ id, label, options, formik}) => {
  const { style } = options
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
    >
      {options.values.map(role => (
        <MenuItem css={style || {}} value={role} key={role}>
          {role}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)};

SelectField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.shape({
    values: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object
  }),
  formik: PropTypes.shape({})
};

export default SelectField;
