import React from "react";
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
        firstName: "", // KELLY - needs to be a date and validated
        lastName: "",
        streetAddress: "",
        addressLine2: "",
        state: "",
        zipcode: "",
        contactType: "",
        contactInformation: "",
        occupation: "",
        employerName: "",
        employerCity: "",
        employerState: "", 
        employerZipcode: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
          <p css={formTitle}>Contributor</p>
          <div>{formSections.firstName}</div>
          <div>{formSections.lastName}</div>
          <div>{formSections.streetAddress}</div>
          <div>{formSections.addressLine2}</div>
          <div>{formSections.city}</div>
          <div>{formSections.state}</div>
          <div>{formSections.zipcode}</div>
          <div>{formSections.contactType}</div>
          <div>{formSections.contactInformation}</div>
          <div>{formSections.occupation}</div>
          <div>{formSections.employerName}</div>
          <div>{formSections.employerCity}</div>
          <div>{formSections.employerState}</div>
          <div>{formSections.employerZipcode}</div>

        </React.Fragment>
      )}
    </ContributorSectionForm>
);

export default AddContributorSection;