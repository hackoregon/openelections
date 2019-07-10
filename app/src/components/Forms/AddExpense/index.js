import React from "react";
import Button from "../../Button/Button";
import AddExpenseForm from "./AddExpenseForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { isLoggedIn } from "../../../state/ducks/auth";
import { connect } from "react-redux";

const container = css`
  width: 96%%;
  min-height: 100%;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const contributorContainer = css`
  width: 96%%;
  min-height: 25px;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const fullWidthContainer = css`
  width: 96%%;
  min-height: 25px;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
  grid-template-columns: 1fr;
  grid-gap: 20px;
`;

const cityStateZip = css`
  width: 96%%;
  min-height: 25px;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
  grid-template-columns: 2fr 22% 24%;
  grid-gap: 20px;
`;

const headerStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
  `,
  leftColumn: css`
    color: red;
  `,
  invoice: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 57px;
    /* identical to box height */
    color: #333333;
  `,
  subheading: css`
    font-family: SofiaProRegular;
    font-size: 16px;
    line-height: 19px;
    color: #333333;
  `,
  labels: css`
    font-family: SofiaProRegular;
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  addLabels: css`
    font-family: SofiaProRegular;
    font-size: 13px;
    line-height: 15px;
    margin-top: 0px;
    /* Link */
    color: #5f5fff;
  `,
  rightColumn: css`
    display: flex;
    justify-content: right;
    flex-direction: column;
    margin-right: 38px;
  `,

  status: css`
    font-family: SofiaProRegular;
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  actualStatus: css`
    font-family: SofiaProRegular;
    font-size: 21px;
    line-height: 25px;
    color: #000000;
    margin-top: 0px;
  `,
  submitButton: css`
    background: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 243px;
  `,
  statusBlock: css`
    display: flex;
    flex-direction: column;
    align-items: left;
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
  margin-top: 55px;
`;

const sectionStyles = css`
  margin-right: 34px;
  margin-bottom: 34px;
  margin-top: 34px;
`;

// HEADER PIECES
const invoiceNumber = "#10000023456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "Draft";
const labelsCount = 0;
const addALabel = "";

const AddExpense = () => (
  <AddExpenseForm
    onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
    initialValues={{
      // BASICS SECTION
      amount: undefined,
      dateOfExpenditure: "", // Date.now(), // FORMAT?
      typeOfExpenditure: "",
      subTypeOfExpenditure: "",
      paymentMethod: "",
      checkNumber: undefined,

      // CONTRIBUTOR SECTION
      payeeType: "",
      payeeName: "",
      streetAddress: "",
      addressLine2: "",
      countryRegion: "",
      city: "Portland",
      state: "OR",
      zipcode: "97201",
      county: "Multnomah",

      // OTHER DETAILS SECTION
      purposeOfExpenditure: "",
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
        <div css={headerStyles.header}>
          <div css={headerStyles.leftColumn}>
            <p css={headerStyles.invoice}>{invoiceNumber}</p>
            <div css={headerStyles.subheading}>
              <p>
                {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
              </p>
            </div>
            <p css={headerStyles.labels}>{`Labels (${labelsCount})`}</p>
            <p css={headerStyles.addLabels}>{`+ Add Labels ${addALabel}`}</p>
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
        </div>
        <hr style={{ marginRight: "38px" }} />

        {/* BASICS SECTION */}
        <div css={sectionStyles}>
          <h3 css={sectionTitle}>Basics</h3>
          <div css={container}>
            <h2>{formFields.amount}</h2>
            <h2>{formFields.dateOfExpenditure}</h2>
            <h2>{formFields.typeOfExpenditure}</h2>
            <h2>{formFields.subTypeOfExpenditure}</h2>
            <h2>{formFields.paymentMethod}</h2>
            <h2>{formFields.checkNumber}</h2>
          </div>
        </div>

        {/* CONTRIBUTOR SECTION */}
        <div css={sectionStyles}>
          <h3 css={sectionTitle}>Contributor</h3>
          <div css={contributorContainer}>
            <h2>{formFields.payeeType}</h2>
            <h2>{formFields.payeeName}</h2>
          </div>
          <h2 css={fullWidthContainer}>{formFields.streetAddress}</h2>
          <h2 css={fullWidthContainer}>{formFields.addressLine2}</h2>
          <div css={cityStateZip}>
            <h2>{formFields.countryRegion}</h2>
            <h2>{formFields.city}</h2>
            <h2>{formFields.state}</h2>
          </div>
          <div css={contributorContainer}>
            <h2>{formFields.zipcode}</h2>
            <h2>{formFields.county}</h2>
          </div>
        </div>

        {/* OTHER DETAILS SECTION */}
        <div css={sectionStyles}>
          <h3 css={sectionTitle}>Other Details</h3>
          <h2 css={fullWidthContainer}>{formFields.purposeOfExpenditure}</h2>
          <h2 css={fullWidthContainer}>{formFields.notes}</h2>
        </div>
      </React.Fragment>
    )}
  </AddExpenseForm>
);
export default connect(state => ({
  isLoggedIn: isLoggedIn(state) || false
}))(AddExpense);
