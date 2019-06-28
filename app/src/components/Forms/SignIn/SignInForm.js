import React from "react";
import * as Yup from "yup";

import Form from "../../Form/Form";
import TextField from "../../Fields/TextField";

const fields = {
  email: {
    label: "Email",
    section: "signIn",
    component: TextField,
    validation: Yup.string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required")
  },
  password: {
    label: "Password",
    section: "signIn",
    component: TextField,
    validation: Yup.string("Enter your password")
        .required("Password is required")
  },
};

const SignInForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={["signIn"]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default SignInForm;
