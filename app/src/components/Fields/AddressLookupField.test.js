import React from "react";
import AddressLookupField from "./AddressLookupField";

describe("<AddressLookupField/>", () => {
  it("should be defined", () => {
    expect(AddressLookupField).toMatchSnapshot();
  });
});
