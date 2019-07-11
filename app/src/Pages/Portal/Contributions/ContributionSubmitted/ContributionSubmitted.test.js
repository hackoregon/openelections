import React from "react";
import { shallow } from "enzyme";
import ContributionSubmitted from "./ContributionSubmitted";

describe("<ContributionSubmitted/>", () => {
  it("should be defined", () => {
    const wrapper = shallow(<ContributionSubmitted />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
