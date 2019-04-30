import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export const SignupForm = (props) => {
  const {
    values: { firstName, lastName, email },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    console.log(errors);
    setFieldTouched(name, true, false);
  };

  return (
   <form onSubmit={handleSubmit}>
      <TextField
        id="email"
        name="email"
        label="Email"
        helperText={touched.email ? errors.email : ""}
        error={touched.email && Boolean(errors.email)}
        value={email}
        onChange={change.bind(null, "email")}
        fullWidth
      />
     <TextField
       id="firstName"
       name="firstName"
       label="First Name"
       helperText={touched.firstName ? errors.firstName : ""}
       error={touched.firstName && Boolean(errors.firstName)}
       value={firstName}
       onChange={change.bind(null, "firstName")}
       fullWidth
     />
     <TextField
       id="lastName"
       name="lastName"
       label="Last Name"
       helperText={touched.lastName ? errors.lastName : ""}
       error={touched.lastName && Boolean(errors.lastName)}
       value={lastName}
       onChange={change.bind(null, "lastName")}
       fullWidth
     />
     <Button
       type="submit"
       fullWidth
       variant="contained"
       color="primary"
       disabled={!isValid}
     >
       Submit
     </Button>
   </form>
 );
};
