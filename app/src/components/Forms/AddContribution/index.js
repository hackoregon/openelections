import React from "react";
import Button from "../../../components/Button/Button";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { isLoggedIn } from "../../../state/ducks/auth";
import { connect } from "react-redux";

const headerStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
  `,
  leftColumn: css`
    color: red;
  `,
  invoice: css`
    font-family: SofiaProRegular;
    font-size: 32px;
    line-height: 37px;
    color: #333333;
    margin-bottom: 0px;
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
  justify-content: space-between;
`;

const fieldStyle = css`
  width: 45%;
`;

const sectionStyles = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 50px;
  margin-right: 38px;
  margin-top: 60px;
`;

const cityStateZip = css`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const stateZip = css`
  width: 45%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

// HEADER PIECES
const invoiceNumber = "#10000023456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "Draft";
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
          <div css={sectionFields}>
            <h2 css={fieldStyle}>{formFields.dateOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.typeOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.subTypeOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.typeOfContributor}</h2>
            <h2 css={fieldStyle}>{formFields.amountOfContribution}</h2>
            <h2 css={fieldStyle}>{formFields.oaeContributionType}</h2>
            <h2 css={fieldStyle}>{formFields.paymentMethod}</h2>
            <h2 css={fieldStyle}>{formFields.checkNumber}</h2>
          </div>
        </div>

        {/* CONTRIBUTOR SECTION */}
        <div css={sectionStyles}>
          <h3 css={sectionTitle}>Contributor</h3>
          <div css={sectionFields}>
            <h2 css={fieldStyle}>{formFields.firstName}</h2>
            <h2 css={fieldStyle}>{formFields.lastName}</h2>
            <h2 css={fieldStyle}>{formFields.streetAddress}</h2>
            <h2 css={fieldStyle}>{formFields.addressLine2}</h2>
            <div css={cityStateZip}>
              <h2 css={fieldStyle}>{formFields.city}</h2>
              <div css={stateZip}>
                <h2 css={fieldStyle}>{formFields.state}</h2>
                <h2 css={fieldStyle}>{formFields.zipcode}</h2>
              </div>
            </div>
            <h2 css={fieldStyle}>{formFields.contactType}</h2>
            <h2 css={fieldStyle}>{formFields.contactInformation}</h2>
            <h2 css={fieldStyle}>{formFields.occupation}</h2>
            <h2 css={fieldStyle}>{formFields.employerName}</h2>
            <div css={cityStateZip}>
              <h2 css={fieldStyle}>{formFields.employerCity}</h2>
              <div css={stateZip}>
                <h2 css={fieldStyle}>{formFields.employerState}</h2>
                <h2 css={fieldStyle}>{formFields.employerZipcode}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* OTHER DETAILS SECTION */}
        <div css={sectionStyles}>
          <h3 css={sectionTitle}>Other Details</h3>
          <div css={sectionFields}>
            <h2 css={fieldStyle}>{formFields.electionAggregate}</h2>
            <h2 css={fieldStyle}>{formFields.description}</h2>
            <h2 css={fieldStyle}>{formFields.occupationLetterDate}</h2>
            <h2 css={fieldStyle}>{formFields.linkToDocumentation}</h2>
            <h2 css={fieldStyle}>{formFields.notes}</h2>
          </div>
        </div>
      </React.Fragment>
    )}
  </AddContributionForm>
);
export default connect(state => ({
  isLoggedIn: isLoggedIn(state) || false
}))(AddContribution);
