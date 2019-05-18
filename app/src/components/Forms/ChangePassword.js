import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export const ChangePasswordForm = props => {
  const {
    values: { oldPassword, newPassword, confirmNewPassword },
    formValues,
    handleStateChange,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    initialValues,
    // setFieldTouched,
    handleBlur,
    resetForm,
    clearState
    // handleReset
  } = props;

  const change = (name, e) => {
    e.persist();
    handleStateChange(name, e);
    handleChange(e);
    console.log(errors);
    // setFieldTouched(name, true, false);
  };

  return (
    <form>
      {console.log({ props })}
      <p>
        To change your password, enter your current password and the new
        password you want to set.
      </p>
      <TextField
        id="oldPassword"
        name="oldPassword"
        label="Old Password"
        helperText={touched.oldPassword ? errors.oldPassword : ""}
        error={touched.oldPassword && Boolean(errors.oldPassword)}
        value={oldPassword}
        onChange={change.bind(null, "oldPassword")}
        onBlur={e => {
          handleBlur(e);
          console.log("blurring", e);
        }}
        fullWidth
      />
      <TextField
        id="newPassword"
        name="newPassword"
        label="New Password"
        helperText={touched.newPassword ? errors.newPassword : ""}
        error={touched.newPassword && Boolean(errors.newPassword)}
        value={newPassword}
        onChange={change.bind(null, "newPassword")}
        fullWidth
      />
      <TextField
        id="confirmNewPassword"
        name="confirmNewPassword"
        label="Confirm New Password"
        helperText={touched.confirmNewPassword ? errors.confirmNewPassword : ""}
        error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
        value={confirmNewPassword}
        onChange={change.bind(null, "confirmNewPassword")}
        fullWidth
      />
      <div className="form-submission-options" style={{ marginTop: 30 + "px" }}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={e => {
            console.log("resetting values", formValues, e);
            resetForm(initialValues);
            clearState();
          }}
        >
          Cancel
        </Button>
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
