import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export const ForgotPasswordForm = props => {
  const {
    values: { email },
    handleStateChange,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    handleBlur
  } = props;

  const change = (name, e) => {
    e.persist();
    handleStateChange(name, e);
    handleChange(e);
    console.log(errors);
  };

  return (
    <form>
      {console.log({ props })}
      <p>Enter your credentials to sign into the portal.</p>
      <TextField
        id="email"
        name="email"
        label="Email"
        autoComplete="email"
        helperText={touched.email ? errors.email : ""}
        error={touched.email && Boolean(errors.email)}
        value={email}
        onChange={change.bind(null, "email")}
        onBlur={e => {
          handleBlur(e);
          console.log("blurring", e);
        }}
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
