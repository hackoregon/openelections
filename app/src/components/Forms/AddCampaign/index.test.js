import React from "react";
import { shallow } from "enzyme";
import AddCampaign from "./index";

describe("<AddCampaign/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<AddCampaign />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
