import React from "react";
import Navigation from "./Navigation";

describe("<Navigation/>", () => {
  it("should be defined", () => {
    expect(Navigation).toMatchSnapshot();
  });
});
