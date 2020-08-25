/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import MaterialButton from '@material-ui/core/Button';

// To add a custom button style, you can create a new buttonType and style. Emotion was not overriding material :(
const manageStyle = {
  border: '1px solid #5F5FFF',
  color: '#5F5FFF',
};

const formDefaultStyle = {
  backgroundColor: '#5F5FFF',
  textTransform: 'none',
  color: '#fff',
  fontFamily: 'Rubik',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '19px',
};

const formDefaultOutlinedStyle = {
  border: '1px solid #5F5FFF',
  color: '#5F5FFF',
  padding: '10px 20px',
  textTransform: 'none',
};

const primaryOverrides = {
  backgroundColor: '#5F5FFF',
  textTransform: 'none',
  color: '#fff',
  fontFamily: 'Rubik',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '19px',
  padding: '10px 20px !important',
};

const remove = {
  backgroundColor: '#FF0000',
  textTransform: 'none',
  color: '#fff',
  fontFamily: 'Rubik',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '19px',
};

const greenStyle = {
  backgroundColor: '#008000',
  color: '#fff',
};

const redStyle = {
  backgroundColor: '#C21F39',
  color: '#fff',
};

const tableButton = {
  width: '92px',
};

const buttonTypes = {
  submit: { type: 'submit', variant: 'contained', color: 'primary' },
  primary: { type: 'submit', variant: 'contained', style: primaryOverrides },
  manage: { type: 'button', variant: 'outlined', style: manageStyle },
  cancel: { type: 'button', variant: 'outlined', color: 'secondary' },
  default: { type: 'button', variant: 'contained', color: 'primary' },
  formDefault: {
    type: 'button',
    variant: 'contained',
    fullWidth: true,
    style: formDefaultStyle,
  },
  formDefaultOutlined: {
    type: 'button',
    variant: 'outlined',
    fullWidth: true,
    style: formDefaultOutlinedStyle,
  },
  remove: {
    type: 'button',
    variant: 'contained',
    style: remove,
    size: 'large',
  },
  green: { type: 'button', variant: 'contained', style: greenStyle },
  tableButton: {
    type: 'button',
    variant: 'contained',
    color: 'primary',
    style: tableButton,
  },
  red: { type: 'button', variant: 'contained', style: redStyle },
  disabledModalButton: {
    type: 'submit',
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
  },
  small: {
    type: 'button',
    variant: 'contained',
    color: 'primary',
    size: 'small',
    style: { ...primaryOverrides, backgroundColor: '#313aa7', borderRadius: 0 },
  },
};

const Button = ({ buttonType, onClick, disabled, style, children }) => {
  const typeOrDefault = Object.keys(buttonTypes).includes(buttonType)
    ? buttonType
    : 'default';
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export default Button;
