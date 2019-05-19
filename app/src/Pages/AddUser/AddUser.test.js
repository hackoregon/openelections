import React from "react";
import { shallow } from "enzyme";
import AddUser from "./AddUser";

describe("<AddUser/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<AddUser />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
