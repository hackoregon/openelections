import React from "react";
import SignInForm from "./SignInForm";

describe("<AddUserForm/>", () => {
  it("should be defined", () => {
    expect(SignInForm).toMatchSnapshot();
  });
});
