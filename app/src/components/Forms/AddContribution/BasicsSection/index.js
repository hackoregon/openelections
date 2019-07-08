import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import BasicsSectionForm from './BasicsSectionForm';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

const AddContributionBasicsSection = () => (
    <BasicsSectionForm
    onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
    initialValues={{
      dateOfContribution: "",
      typeOfContribution: "",
      subTypeOfContribution: "",
      typeOfContributor: "",
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
        <p css={formTitle}>Basics</p>
        <div>{formSections.dateOfContribution}</div>

        <div>{formSections.typeOfContribution}</div>

        {formSections.subTypeOfContribution} 
        {formSections.typeOfContributor} 
        {formSections.amountOfContribution} 
        {formSections.oaeContributionType} 
        {formSections.paymentMethod} 
        {formSections.checkNumber} 
      </React.Fragment>
    )}
    </BasicsSectionForm>
);

export default AddContributionBasicsSection;
