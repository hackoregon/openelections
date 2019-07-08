import React from "react";
import OtherDetailsSectionForm from "./OtherDetailsSectionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

const OtherDetailsSection = () => (
    <OtherDetailsSectionForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        electionAggregate: "", 
        description: "",
        occupationLetterDate: "",
        linkToDocumentation: "",
        notes: "",

      }}
    >
      {({
        formSections,
      }) => (
        <React.Fragment>
          <p css={formTitle}>Other Details</p>
          <div>{formSections.electionAggregate}</div>
          <div>{formSections.description}</div>
          <div>{formSections.occupationLetterDate}</div>
          <div>{formSections.linkToDocumentation}</div>
          <div>{formSections.notes}</div>
        </React.Fragment>
      )}
    </OtherDetailsSectionForm>
);

export default OtherDetailsSection;