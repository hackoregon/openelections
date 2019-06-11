import React from "react";
import MaterialButton from "@material-ui/core/Button";

const buttonTypes = {
  submit: { type: "submit", variant: "contained", color: "primary" },
  cancel: { type: "button", variant: "outlined", color: "secondary" },
  default: { type: "button", variant: "contained", color: "primary" }
};

const Button = ({ buttonType, onClick, disabled, children }) => (
  <MaterialButton
    onClick={onClick}
    disabled={disabled}
    {...buttonTypes[buttonType]}
  >
    {children}
  </MaterialButton>
);

export default Button;
