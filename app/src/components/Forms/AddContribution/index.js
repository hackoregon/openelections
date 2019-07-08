import React from "react";
import Button from "../../../components/Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import OtherDetailsSection from "./OtherDetailsSection/index";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

const subTitle = css`
  font-family: SofiaProRegular;
  font-size: 16px;
  line-height: 19px;

  color: #333333;
`;

const currentStatus = css`
  font-family: SofiaProRegular;
  font-size: 13px;
  line-height: 15px;

  color: #979797;
`;

const AddContribution = () => (
  <AddContributionForm
    onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
    initialValues={{
      // HEADER SECTION
      invoiceNumber: "#123456",
      campaignName: "Fake Campaign Name",
      lastEdited: "date",
      currentStatus: "",
      labelsCount: "",
      addALabel: "",

      // BASICS SECTION
      dateOfContribution: "",
      typeOfContribution: "",
      subTypeOfContribution: "",
      typeOfContributor: "",
      amountOfContribution: "",
      oaeContributionType: "",
      paymentMethod: "",
      checkNumber: "",

      // CONTRIBUTOR SECTION
      firstName: "",
      lastName: "",
      streetAddress: "",
      addressLine2: "",
      city: "",
      state: "",
      zipcode: "",
      contactType: "",
      contactInformation: "",
      occupation: "",
      employerName: "",
      employerCity: "",
      employerState: "",
      employerZipcode: "",

      // OTHER DETAILS SECTION
      electionAggregate: "",
      description: "",
      occupationLetterDate: "",
      linkToDocumentation: "",
      notes: ""
    }}
  >
    {({ formSections, isValid, handleSubmit /* isDirty, isSubmitting */ }) => (
      <React.Fragment>
        <Button buttonType="submit" disabled={!isValid} onClick={handleSubmit}>
          Submit Contribution
        </Button>

        <div>{formSections.headerSection}</div>
        <p css={formTitle}>Basics</p>
        <div>{formSections.basicsSection}</div>
        <p css={formTitle}>Contributor</p>
        <div>{formSections.contributorSection}</div>
        <p css={formTitle}>Other Details</p>
        <div>{formSections.OtherDetailsSection}</div>
      </React.Fragment>
    )}
  </AddContributionForm>
);
export default AddContribution;
