import React from "react";
import ContributorSectionForm from "./ContributorSectionForm";

describe("<ContributorSectionForm/>", () => {
  it("should be defined", () => {
    expect(ContributorSectionForm).toMatchSnapshot();
  });
});
