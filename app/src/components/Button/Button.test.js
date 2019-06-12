import React from "react";
import Button from "./Button";

describe("<Button/>", () => {
  it("should be defined", () => {
    expect(Button).toMatchSnapshot();
  });
});
