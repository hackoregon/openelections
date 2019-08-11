/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import PropTypes from "prop-types";
import MaterialButton from "@material-ui/core/Button";

// To add a custom button style, you can create a new buttonType and style. Emotion was not overriding material :(
const manageStyle = {
  border: "1px solid #5F5FFF",
  color: "#5F5FFF",
  borderRadius: "5px",
  lineHeight: "17px",
  padding: "6px 16px"
};

const formDefaultStyle = {
  backgroundColor: "#5F5FFF",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  lineHeight: "19px",
  borderRadius: "5px",
  padding: "6px 16px"
}

const formDefaultOutlinedStyle = {
  border: "1px solid #5F5FFF",
  color: "#5F5FFF",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  lineHeight: "17px",
  fontSize: "16px",
  textTransform: "none",
  borderRadius: "5px",
  padding: "6px 16px"
};

const primaryOverrides = {
  backgroundColor: "#5F5FFF",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  lineHeight: "19px",
  // padding: "10px 20px !important",  // need to check where this matters
  borderRadius: "5px",
  padding: "6px 16px"
};

const remove = {
  backgroundColor: "#FF0000",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  lineHeight: "19px",
  borderRadius: "5px",
  padding: "6px 16px"
};

const greenStyle = {
  backgroundColor: "#42B44A",
  color: "#fff",
  borderRadius: "5px",
  padding: "6px 16px"
};

const buttonTypes = {
  submit: { type: "submit", variant: "contained", color: "primary", style: formDefaultStyle },
  primary: { type: "submit", variant: "contained", style: primaryOverrides },
  manage: { type: "button", variant: "outlined", style: manageStyle },
  cancel: { type: "button", variant: "outlined", color: "secondary", style: formDefaultOutlinedStyle },
  default: { type: "button", variant: "contained", color: "primary", style: formDefaultStyle },
  formDefault: { type: "button", variant: "contained", fullWidth: true, style: formDefaultStyle },
  formDefaultOutlined: { type: "button", variant: "outlined", fullWidth: true, style: formDefaultOutlinedStyle },
  remove: { type: "button", variant: "contained", style: remove, size: "large" },
  green: { type: "button", variant: "contained", style: greenStyle}
};

const Button = ({ buttonType, onClick, disabled, style, children }) => {
  const typeOrDefault = Object.keys(buttonTypes).includes(buttonType)
    ? buttonType
    : "default";
  return (
    <MaterialButton
      css={style}
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
  disabled: PropTypes.bool,
  style: PropTypes.object
};

export default Button;
