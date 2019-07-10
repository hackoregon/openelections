import React from "react";
import FlashMessages from "./FlashMessages";

describe("<FlashMessages/>", () => {
  it("should be defined", () => {
    expect(FlashMessages).toMatchSnapshot();
  });
});
