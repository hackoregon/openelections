import React from "react";
import Button from "../../../Button/Button";
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
        electionAggregate: '07/04/2019', 
        description: 'some words here',
        occupationLetterDate: "some date here",
        linkToDocumentation: "not sure what this will be",
        notes: "notes about something",

      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit /* isDirty, isSubmitting */
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