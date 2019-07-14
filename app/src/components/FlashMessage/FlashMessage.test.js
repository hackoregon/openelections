import React from "react";
import FlashMessage from "./FlashMessage";

describe("<FlashMessage/>", () => {
  it("should be defined", () => {
    expect(FlashMessage).toMatchSnapshot();
  });
})