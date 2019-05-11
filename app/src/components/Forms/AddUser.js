import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
export const AddUserForm = (props) => {


  const {
    values: { userRole, firstName, lastName, email },
    userRoles,
    formValues,
    handleStateChange,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    initialValues,
    setFieldTouched,
    // handleBlur ,
    resetForm,
    clearState,
    // handleReset
  } = props;
  


  const change = (name, e) => {
    e.persist();
    handleStateChange(name, e);
    handleChange(e)
    console.log(errors);
    setFieldTouched(name, true, false);
  };

  return (
   <form>
   {console.log({props})}
    <p style={{
      fontSize: 35 + 'px',
      letterSpacing: -2 + 'px'
      }}>Add a New User</p>
    <FormControl>
      <InputLabel htmlFor="userRole">Role</InputLabel>
      <Select 
        value={userRole}
        onChange={change.bind(null, "userRole")}
        // onBlur={handleBlur}
        inputProps={{
          name: 'userRole',
          id: 'userRole',
        }}
        autoWidth
        >
          {userRoles.map( role => <MenuItem value={role} key={role}>{ role }</MenuItem>)}
      </Select>
    </FormControl>
    <p>Enter the user's information and we will send them an email with instructions to join your portal.</p>
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
    <div 
      className="form-submission-options"
      style={{marginTop: 30 + 'px'}}
    >
    <Button
      type="button"
      variant="outlined"
      color="secondary"
      onClick={(e) => {
        console.log('resetting values', formValues, e);
        resetForm(initialValues)
        clearState()
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
