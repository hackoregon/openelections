import React from "react";
import UserInfoBox from "./Sidebar";

describe("<UserInfoBox/>", () => {
  it("should be defined", () => {
    expect(UserInfoBox).toMatchSnapshot();
  });
});
