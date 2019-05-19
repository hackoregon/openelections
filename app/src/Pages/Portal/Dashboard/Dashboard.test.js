import React from "react";
import { shallow } from "enzyme";
import Dashboard from "./Dashboard";

describe("<Dashboard/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
