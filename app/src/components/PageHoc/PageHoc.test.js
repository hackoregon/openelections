import React from "react";
import PageHoc from "./PageHoc";

describe("<PageHoc/>", () => {
  it("should be defined", () => {
    expect(PageHoc).toMatchSnapshot();
  });
});
