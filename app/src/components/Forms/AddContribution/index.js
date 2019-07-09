import React from "react";
import Button from "../../../components/Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { isLoggedIn } from "../../../state/ducks/auth";
import { connect } from "react-redux";

const headerStyles = {
  invoice: css`
    font-family: SofiaProRegular;
    font-size: 32px;
    line-height: 37px;
    color: #333333;
  `,
  rightColumn: css`
    display: flex;
    justifycontent: right;
  `,

  status: css`
    font-family: SofiaProRegular;
    font-size: 13px;
    line-height: 15px;
    color: #979797;
  `,

  actualStatus: css`
    font-family: SofiaProRegular;
    font-size: 21px;
    line-height: 25px;
    color: #000000;
  `,
  submitButton: css`
    background: #d8d8d8;
    border-radius: 5px;
    color: white;
  `,
  statusBlock: css`
    display: flex;
    flexdirection: column;
    alignitems: left;
  `,
  subheading: css`
    font-family: SofiaProRegular;
    font-size: 16px;
    line-height: 19px;
    color: #333333;
  `
};

const sectionTitle = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  width: 100%;
  color: #000000;
`;

const sectionFields = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
  /* identical to box height */
  color: #333333;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: green;
`;

const fieldStyle = css`
  background-color: red;
  width: 40%;
  color: orange;
  margin: 2px;
`;

const basicsStyles = css`
  background-color: hotpink;
  margin: 2%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
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
    {({
      formSections,
      formFields,
      isValid,
      handleSubmit /* isDirty, isSubmitting */
    }) => (
      <React.Fragment>
        {/* HEADER SECTION */}
        <p css={headerStyles.invoice}>{invoiceNumber}</p>
        <div css={headerStyles.subheading}>
          <p>
            {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
          </p>
        </div>
        <div css={headerStyles.rightColumn}>
          <div css={headerStyles.statusBlock}>
            <p css={headerStyles.status}>Current Status</p>
            <p css={headerStyles.actualStatus}>{currentStatus}</p>
          </div>
          <Button
            css={headerStyles.submitButton}
            buttonType="submit"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Submit Contribution
          </Button>
        </div>
        <p>{`Labels (${labelsCount})`}</p>
        <p>{`+ Add Labels ${addALabel}`}</p>

        {/* BASICS SECTION */}
        <div css={basicsStyles}>
          <h3 css={sectionTitle}>Basics</h3>
          <div css={sectionFields}>
            <h2 css={fieldStyle}>{formFields.dateOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.typeOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.subTypeOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.amountOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.oaeContributionType}</h2>
            <h2 css={fieldStyle}>{formFields.paymentMethod}</h2>
            <h2 css={fieldStyle}>{formFields.checkNumber}</h2>
          </div>
        </div>

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
