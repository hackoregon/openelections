import React from "react";
import Button from "../../../components/Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { isLoggedIn } from "../../../state/ducks/auth";
import { connect } from "react-redux";

const invoice = css`
  font-family: SofiaProRegular;
  font-size: 32px;
  line-height: 37px;
  color: #333333;
`;

const rightColumn = css`
  display: flex;
  justifycontent: right;
`;

const status = css`
  font-family: SofiaProRegular;
  font-size: 13px;
  line-height: 15px;
  color: #979797;
`;

const actualStatus = css`
  font-family: SofiaProRegular;
  font-size: 21px;
  line-height: 25px;
  color: #000000;
`;

const submitButton = css`
  background: #d8d8d8;
  border-radius: 5px;
  color: white;
`;

const statusBlock = css`
  display: flex;
  flexdirection: column;
  alignitems: left;
`;

const subheading = css`
  font-family: SofiaProRegular;
  font-size: 16px;
  line-height: 19px;
  color: #333333;
`;

const sectionTitle = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const formFields = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
  /* identical to box height */
  color: #333333;
`;

// HEADER PIECES
const invoiceNumber = "#10000023456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "draft";
const labelsCount = 0;
const addALabel = "";

const AddContribution = () => (
  <AddContributionForm
    onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
    initialValues={{
      // BASICS SECTION
      dateOfContribution: "", // Date.now(), // FORMAT?
      typeOfContribution: "",
      subTypeOfContribution: "",
      typeOfContributor: "",
      amountOfContribution: undefined,
      oaeContributionType: "",
      paymentMethod: "",
      checkNumber: undefined,

      // CONTRIBUTOR SECTION
      firstName: "",
      lastName: "",
      streetAddress: "",
      addressLine2: "",
      city: "Portland",
      state: "OR",
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
        <p css={invoice}>{invoiceNumber}</p>
        <div css={subheading}>
          <p>
            {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
          </p>
        </div>
        <div css={rightColumn}>
          <div css={statusBlock}>
            <p css={status}>Current Status</p>
            <p css={actualStatus}>{currentStatus}</p>
          </div>
          <Button
            css={submitButton}
            buttonType="submit"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Submit Contribution
          </Button>
        </div>
        <p>{`Labels (${labelsCount})`}</p>
        <p>{`+ Add Labels ${addALabel}`}</p>
        <h3 css={sectionTitle}>Basics</h3>
        <div css={formFields}>{formSections.basicsSection}</div>
        <p css={sectionTitle}>Contributor</p>
        <div>{formSections.contributorSection}</div>
        <p css={sectionTitle}>Other Details</p>
        <div>{formSections.otherDetailsSection}</div>
      </React.Fragment>
    )}
  </AddContributionForm>
);
export default connect(state => ({
  isLoggedIn: isLoggedIn(state) || false
}))(AddContribution);
