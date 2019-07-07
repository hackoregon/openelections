import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
// import Portal from '../../../Pages/Portal/Portal';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;


// const leftAlign = css`
//   align-self: flex-start;
// `;

const AddContribution = () => (
  <>
  {/* <Portal/> */}
  <FormModal style={{width: '90%'}}>
    <AddContributionForm
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
        handleCancel,
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
    </AddContributionForm>
  </FormModal>
  </>
);

export default AddContribution;
