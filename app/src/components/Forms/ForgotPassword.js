/* eslint-disable react/jsx-no-bind */
// TODO Refactor bind. Remove above.
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export const ForgotPasswordForm = props => {
  const {
    values: { email },
    handleStateChange,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    handleBlur,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleStateChange(name, e);
    handleChange(e);
  };

  return (
    <form>
      <p>Enter your credentials to sign into the portal.</p>
      <TextField
        id="email"
        name="email"
        label="Email"
        autoComplete="email"
        helperText={touched.email ? errors.email : ''}
        error={touched.email && Boolean(errors.email)}
        value={email}
        onChange={change.bind(null, 'email')}
        onBlur={e => {
          handleBlur(e);
        }}
        fullWidth
      />
      <div className="form-submission-options" style={{ marginTop: `${30}px` }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

ForgotPasswordForm.propTypes = {
  values: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf]),
  handleStateChange: PropTypes.func,
  errors: PropTypes.oneOfType([PropTypes.object]),
  touched: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isValid: PropTypes.bool,
  handleBlur: PropTypes.func,
};
