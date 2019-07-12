import React from "react";
import ContributionNeedsReview from "./ContributionNeedsReview";

describe("<ContributionNeedsReview/>", () => {
  it("should be defined", () => {
    expect(ContributionNeedsReview).toMatchSnapshot();
  });
});
