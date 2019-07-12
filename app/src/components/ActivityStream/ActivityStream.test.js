import React from "react";
import ActivityStream from "./index";

describe("<ActivityStream/>", () => {
  it("should be defined", () => {
    expect(ActivityStream).toMatchSnapshot();
  });
});
