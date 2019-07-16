import React from "react";
import { shallow } from "enzyme";
import Invitation from "./Invitation";

describe("<Invitation />", () => {
  it("should be defined", () => {
    const wrapper = shallow(<Invitation />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
