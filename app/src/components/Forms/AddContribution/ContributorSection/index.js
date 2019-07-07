import React from "react";
import Button from "../../../Button/Button";
import ContributorSectionForm from "./ContributorSectionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

const AddContributorSection = () => (
    <ContributorSectionForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        dateOfContribution: '07/04/2019', // KELLY - needs to be a date and validated
        typeOfContribution: "Contribution",
        subTypeOfContribution: "Cash Contribution",
        amountOfContribution: 100.00,
        oaeContributionType: "Seed Money",
        paymentMethod: "Cash",
        checkNumber: 192
      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
          <p css={formTitle}>Contributor</p>
          <div>{formSections.invoiceNumber}</div>
          <div>{formSections.campaignName}</div>
          <div>{formSections.lastEdited}</div>
          <div>{formSections.currentStatus}</div>
          <div>{formSections.labelsCount}</div>
          <div>{formSections.addALabel}</div>
        </React.Fragment>
      )}
    </ContributorSectionForm>
);

export default AddContributorSection;
