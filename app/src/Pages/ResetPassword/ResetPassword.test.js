import React from "react";
import { shallow } from "enzyme";
import ResetPassword from "./ResetPassword";

describe("<ResetPassword/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<ResetPassword />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
