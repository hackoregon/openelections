import React from "react";
import { shallow } from "enzyme";
import SignIn from "./SignIn";

describe("<SignIn/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
