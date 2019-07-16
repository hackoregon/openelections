import React from "react";
import { shallow } from "enzyme";
import ManageUser from "./ManageUser";

describe("<ManageUser/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<ManageUser />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
