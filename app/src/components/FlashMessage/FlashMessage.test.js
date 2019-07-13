import React from "react";
import FlashMessages from "./FlashMessage";

describe("<FlashMessages/>", () => {
  it("should be defined", () => {
    expect(FlashMessages).toMatchSnapshot();
  });
});
