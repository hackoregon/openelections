import React from "react";
import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";
import App from "./App";

describe("<App/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
