import React from "react";
import { shallow } from "enzyme";
import UpdateForgottenPassword from "./UpdateForgottenPassword";

describe("<UpdateForgottenPassword/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<UpdateForgottenPassword />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
