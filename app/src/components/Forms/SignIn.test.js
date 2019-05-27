import React from "react";
import { SignInForm } from "./SignIn";

describe("<SignInForm/>", () => {
  it("should be defined", () => {
    expect(SignInForm).toMatchSnapshot();
  });
});
