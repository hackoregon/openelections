import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export const UpdateForgottenPasswordForm = props => {
  const {
    values: { newPassword, confirmNewPassword },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    handleBlur
  } = props;

  return (
    <form>
      <p>Use at least 6 characters in your updated password.</p>
      <TextField
        id="newPassword"
        name="newPassword"
        label="New Password"
        type="password"
        autoComplete="new-password"
        helperText={touched.newPassword ? errors.newPassword : ""}
        error={touched.newPassword && Boolean(errors.newPassword)}
        value={newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
      />
      <TextField
        id="confirmNewPassword"
        name="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        autoComplete="new-password"
        helperText={touched.confirmNewPassword ? errors.confirmNewPassword : ""}
        error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
        value={confirmNewPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
      />
      <div className="form-submission-options" style={{ marginTop: 30 + "px" }}>
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
