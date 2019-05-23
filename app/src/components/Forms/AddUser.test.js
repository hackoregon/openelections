import React from "react";
import { AddUserForm } from "./AddUser";

describe("<AddUserForm/>", () => {
  it("should be defined", () => {
    expect(AddUserForm).toMatchSnapshot();
  });
});
