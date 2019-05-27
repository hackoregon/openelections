import React from "react";
import { ForgotPasswordForm } from "./ForgotPassword";

describe("<ForgotPasswordForm/>", () => {
  it("should be defined", () => {
    expect(ForgotPasswordForm).toMatchSnapshot();
  });
});
