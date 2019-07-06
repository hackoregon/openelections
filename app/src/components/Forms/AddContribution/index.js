import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Portal from '../../../Pages/Portal/Portal';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;
const leftAlign = css`
  align-self: flex-start;
`;

const AddContribution = () => (
  <>
  <Portal/>
  <FormModal>
    <AddContributionForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        userRole: "Staff",
        email: "",
        firstName: "",
        lastName: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
          <p css={formTitle}>Basics</p>
          <div css={leftAlign}>{formSections.dateOfContribution}</div>

          <div css={leftAlign}>{formSections.typeOfContribution}</div>
 
          {formSections.subTypeOfContribution} 
          {formSections.typeOfContributor} 
          {formSections.amountOfContribution} 
          {formSections.oaeContributionType} 
          {formSections.paymentMethod} 
          {formSections.checkNumber} 
          <div css={buttonWrapper}>
            <Button buttonType="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              buttonType="submit"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </React.Fragment>
      )}
    </AddContributionForm>
  </FormModal>
  </>
);

export default AddContribution;
