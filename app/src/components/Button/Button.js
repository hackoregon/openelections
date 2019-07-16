import React from "react";
import PropTypes from "prop-types";
import MaterialButton from "@material-ui/core/Button";

// To add a custom button style, you can create a new buttonType and style. Emotion was not overriding material :(
const manageStyle = {
  border: "1px solid #5F5FFF",
  color: "#5F5FFF"
};

const primaryOverrides = {
  backgroundColor: "#5F5FFF",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  lineHeight: "19px"
};

const remove = {
  backgroundColor: "#FF0000",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  lineHeight: "19px"
};

const buttonTypes = {
  submit: { type: "submit", variant: "contained", color: "primary" },
  primary: { type: "submit", variant: "contained", style: primaryOverrides },
  manage: { type: "button", variant: "outlined", style: manageStyle },
  cancel: { type: "button", variant: "outlined", color: "secondary" },
  default: { type: "button", variant: "contained", color: "primary" },
  remove: { type: "button", variant: "contained", style: remove, size: "large" }
};

const Button = ({ buttonType, onClick, disabled, children }) => {
  const typeOrDefault = Object.keys(buttonTypes).includes(buttonType)
    ? buttonType
    : "default";
  return (
    <MaterialButton
      onClick={onClick}
      disabled={disabled}
      {...buttonTypes[typeOrDefault]}
    >
      {children}
    </MaterialButton>
  );
};

Button.propTypes = {
  buttonType: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Button;
