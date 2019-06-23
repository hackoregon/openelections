import React from "react";
import { shallow } from "enzyme";
import ChangePassword from "./ChangePassword";

describe("<ChangePassword/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<ChangePassword />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
