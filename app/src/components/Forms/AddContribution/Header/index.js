import React from "react";
import Button from "../../../Button/Button";
import HeaderSectionForm from "./HeaderSectionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const AddContributionHeader = () => (
    <HeaderSectionForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        dateOfContribution: "", 
        typeOfContribution: "",
        subTypeOfContribution: "",
        amountOfContribution: "",
        oaeContributionType: "",
        paymentMethod: "",
        checkNumber: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
        <Button
          buttonType="submit"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Submit Contribution
        </Button>
          <div>{formSections.invoiceNumber}</div>
          <div>{formSections.campaignName}</div>
          <div>{formSections.lastEdited}</div>
          <div>{formSections.currentStatus}</div>
          <div>{formSections.labelsCount}</div>
          <div>{formSections.addALabel}</div>
        </React.Fragment>
      )}
    </HeaderSectionForm>
);

export default AddContributionHeader;
