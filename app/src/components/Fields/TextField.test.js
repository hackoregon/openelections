import React from "react";
import TextField from "./TextField";

describe("<TextField/>", () => {
  it("should be defined", () => {
    expect(TextField).toMatchSnapshot();
  });
});
