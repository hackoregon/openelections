import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";

describe("<ChangePasswordForm/>", () => {
  it("should be defined", () => {
    expect(ChangePasswordForm).toMatchSnapshot();
  });
});
