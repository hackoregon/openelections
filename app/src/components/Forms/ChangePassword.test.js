import React from "react";
import { ChangePasswordForm } from "./ChangePassword";

describe("<ChangePasswordForm/>", () => {
  it("should be defined", () => {
    expect(ChangePasswordForm).toMatchSnapshot();
  });
});
