import React from "react";
import SearchBox from "./SearchBox";

describe("<SearchBox/>", () => {
  it("should be defined", () => {
    expect(SearchBox).toMatchSnapshot();
  });
});
