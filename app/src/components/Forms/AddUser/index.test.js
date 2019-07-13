import React from "react";
import { shallow } from "enzyme";
import AddUser from "./index";

describe("<AddUser/>", () => {
  it("should be defined", async () => {
    const wrapper = await shallow(<AddUser />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
