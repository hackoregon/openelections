import React from "react";
import { fields } from './ContributionsFields';

const formFieldKeys = [
  "dateOfContribution",
  "typeOfContribution",
  "subTypeOfContribution",
  "typeOfContributor",
  "amountOfContribution",
  "oaeContributionType",
  "paymentMethod",
  "checkNumber",
  "firstName",
  "lastNameOrEntity",
  "streetAddress",
  "addressLine2",
  "city",
  "state",
  "zipcode",
  "contactType",
  "contactInformation",
  "occupation",
  "employerName",
  "employerCity",
  "employerState",
  "employerZipcode",
  "electionAggregate",
  "description",
  "occupationLetterDate",
  "linkToDocumentation",
  "notes"
]

describe("fields", () => {
  it("should have the expected field keys", () => {
    Object.keys(fields).every(field => formFieldKeys.includes(field))
  })
})