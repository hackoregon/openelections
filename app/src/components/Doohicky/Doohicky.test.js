import React from "react";
import { shallow } from "enzyme";
import Doohicky from "./index";

describe("<Doohicky/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<Doohicky />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
