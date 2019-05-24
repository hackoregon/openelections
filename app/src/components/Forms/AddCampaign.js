import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
export const AddCampaignForm = props => {
  const {
    values: { campaignName, firstName, lastName, email },
    formValues,
    handleStateChange,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    initialValues,
    handleBlur,
    resetForm,
    clearState
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
      <p>
        Enter the user's information and we will shoot them an email with
        instructions to join their new Campaign portal.
      </p>
      <TextField
        id="campaignName"
        name="campaignName"
        label="Campaign Name"
        helperText={touched.campaignName ? errors.campaignName : ""}
        error={touched.campaignName && Boolean(errors.campaignName)}
        value={campaignName}
        onChange={change.bind(null, "campaignName")}
        fullWidth
      />
      <TextField
        id="firstName"
        name="firstName"
        label="Candidate's First Name"
        helperText={touched.firstName ? errors.firstName : ""}
        error={touched.firstName && Boolean(errors.firstName)}
        value={firstName}
        onChange={change.bind(null, "firstName")}
        fullWidth
      />
      <TextField
        id="lastName"
        name="lastName"
        label="Candidate's Last Name"
        helperText={touched.lastName ? errors.lastName : ""}
        error={touched.lastName && Boolean(errors.lastName)}
        value={lastName}
        onChange={change.bind(null, "lastName")}
        fullWidth
      />
      <TextField
        id="email"
        name="email"
        label="Candidate's Email"
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
      <div
        className="form-submission-options"
        style={{ marginTop: 30 + "px" }}
      >
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
