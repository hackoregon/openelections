import React from "react";
import ContributionSubmittedForm from "./ContributionSubmittedForm";

describe("<ContributionSubmittedForm/>", () => {
  it("should be defined", () => {
    expect(ContributionSubmittedForm).toMatchSnapshot();
  });
});
