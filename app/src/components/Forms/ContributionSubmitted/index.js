import React from "react";
import Button from "../../Button/Button";
// import ContributionSubmittedForm from "./ContributionSubmittedForm.js";
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

const addressContainer = css`
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
    margin-bottom: 0px;
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

const fieldLabels = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: rgba(0, 0, 0, 0.65);
`;

const sectionValues = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
  /* identical to box height */
  color: #333333;
  margin: 0px;
`;

// HEADER PIECES
const invoiceNumber = "#10000023456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "Submitted";
const labelsCount = 0;
const addALabel = "";

// BASICS INITIAL VALUES
const basicsValues = {
  dateOfContribution: "09/09/2019", // Date.now(), // FORMAT?
  typeOfContribution: "Contribution",
  subTypeOfContribution: "In-Kind Contribution",
  typeOfContributor: "Individual",
  amountOfContribution: undefined,
  oaeContributionType: "Matchable",
  paymentMethod: "Check",
  checkNumber: undefined
};

// CONTRIBUTOR INITIAL VALUES
const contributorValues = {
  firstName: "Helen",
  lastName: "Troy",
  streetAddress: "2526 Race Street",
  addressLine2: "",
  city: "Portland",
  state: "OR",
  zipcode: "97212",
  contactType: "Email",
  contactInformation: "s.helen@example.com",
  occupation: "Program Manager",
  employerName: "Self Employed",
  employerCity: "Portland",
  employerState: "OR",
  employerZipcode: "97212"
};

// OTHER DETAILS INITIAL VALUES
const otherDetailsValues = {
  electionAggregate: "2019",
  description: "Some Description",
  occupationLetterDate: "",
  linkToDocumentation: "",
  notes: ""
};
const ContributionSubmitted = () => (
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
        <div style={{ display: "flex" }}>
          <div style={{ flexDirection: "column", marginRight: "40px" }}>
            <p css={headerStyles.labels}>{`Labels (${labelsCount})`}</p>
            <p style={{ fontSize: "7px" }}>()()()</p>
            {/* placeholder for icon ^ */}
            <p css={headerStyles.addLabels}>Manage</p>
          </div>
          <div css={headerStyles.statusBlock}>
            <p css={headerStyles.status}>Current Status</p>
            <p css={headerStyles.actualStatus}>{currentStatus}</p>
            <p
              style={{
                marginTop: "0px",
                fontSize: "9px",
                color: "#5f5fff"
              }}
            >
              Jump to Activity ꜜ
            </p>
          </div>
        </div>
      </div>
      <div css={headerStyles.rightColumn}>
        <Button css={headerStyles.submitButton} buttonType="submit">
          Submitted
        </Button>
      </div>
    </div>
    <hr style={{ marginRight: "38px" }} />

    {/* BASICS SECTION */}
    <div css={sectionStyles}>
      <h3 css={sectionTitle}>Basics</h3>
      <div css={container}>
        <div>
          <p css={fieldLabels}>Date of Contribution</p>
          <p css={sectionValues}>{basicsValues.dateOfContribution}</p>
        </div>
        <div>
          <p css={fieldLabels}>Contribution Type</p>
          <p css={sectionValues}>{basicsValues.typeOfContribution}</p>
        </div>
        <div>
          <p css={fieldLabels}>Contribution Sub Type</p>
          <p css={sectionValues}>{basicsValues.subTypeOfContribution}</p>
        </div>
        <div>
          <p css={fieldLabels}>Type of Contributor</p>
          <p css={sectionValues}>{basicsValues.typeOfContributor}</p>
        </div>
        <div>
          <p css={fieldLabels}>Amount of Contribution</p>
          <p css={sectionValues}>{basicsValues.amountOfContribution}</p>
        </div>
        <div>
          <p css={fieldLabels}>OAE Contribution Type</p>
          <p css={sectionValues}>{basicsValues.oaeContributionType}</p>
        </div>
        <div>
          <p css={fieldLabels}>Payment Method</p>
          <p css={sectionValues}>{basicsValues.paymentMethod}</p>
        </div>
        <div>
          <p css={fieldLabels}>Check Number</p>
          <p css={sectionValues}>{basicsValues.checkNumber}</p>
        </div>
      </div>
    </div>

    {/* CONTRIBUTOR SECTION */}
    <div css={sectionStyles}>
      <h3 css={sectionTitle}>Contributor</h3>
      <div css={container}>
        <div>
          <p css={fieldLabels}>First Name</p>
          <p css={sectionValues}>{contributorValues.firstName}</p>
        </div>
        <div>
          <p css={fieldLabels}>Last Name</p>
          <p css={sectionValues}>{contributorValues.lastName}</p>
        </div>
        <div>
          <p css={fieldLabels}>Address Line</p>
          <p css={sectionValues}>{contributorValues.streetAddress}</p>
        </div>
        <div>
          <p css={fieldLabels}>Address Line 2</p>
          <p css={sectionValues}>{contributorValues.addressLine2}</p>
        </div>
        <div css={cityStateZip}>
          <div>
            <p css={fieldLabels}>City</p>
            <p css={sectionValues}>{contributorValues.city}</p>
          </div>
          <div>
            <p css={fieldLabels}>State</p>
            <p css={sectionValues}>{contributorValues.state}</p>
          </div>
          <div>
            <p css={fieldLabels}>Zipcode</p>
            <p css={sectionValues}>{contributorValues.zipcode}</p>
          </div>
        </div>
        <div>
          <p css={fieldLabels}>Contact Type</p>
          <p css={sectionValues}>{contributorValues.contactType}</p>
        </div>
        <div>
          <p css={fieldLabels}>Contact Information</p>
          <p css={sectionValues}>{contributorValues.contactInformation}</p>
        </div>
        <div>
          <p css={fieldLabels}>Occupation</p>
          <p css={sectionValues}>{contributorValues.occupation}</p>
        </div>
        <div>
          <p css={fieldLabels}>Employer</p>
          <p css={sectionValues}>{contributorValues.employerName}</p>
        </div>
        <div css={cityStateZip}>
          <div>
            <p css={fieldLabels}>Employer City</p>
            <p css={sectionValues}>{contributorValues.employerCity}</p>
          </div>
          <div>
            <p css={fieldLabels}>Employer State</p>
            <p css={sectionValues}>{contributorValues.employerState}</p>
          </div>
          <div>
            <p css={fieldLabels}>Employer Zipcode</p>
            <p css={sectionValues}>{contributorValues.employerZipcode}</p>
          </div>
        </div>
      </div>
    </div>

    {/* OTHER DETAILS SECTION */}
    <div css={sectionStyles}>
      <h3 css={sectionTitle}>Other Details</h3>
      <div css={container}>
        <div>
          <p css={fieldLabels}>Election Aggregate</p>

          <p css={sectionValues}>{otherDetailsValues.electionAggregate}</p>
        </div>
        <div>
          <p css={fieldLabels}>Description</p>
          <p css={sectionValues}>{otherDetailsValues.description}</p>
        </div>
        <div>
          <p css={fieldLabels}>Occupation Letter Date</p>
          <p css={sectionValues}>{otherDetailsValues.occupationLetterDate}</p>
        </div>
        <div>
          <p css={fieldLabels}>Link to Documentation</p>
          <p css={sectionValues}>{otherDetailsValues.linkToDocumentation}</p>
        </div>
        <div>
          <p css={fieldLabels}>Notes</p>
          <p css={sectionValues}>{otherDetailsValues.notes}</p>
        </div>
      </div>
    </div>
  </React.Fragment>
);
export default connect(state => ({
  isLoggedIn: isLoggedIn(state) || false
}))(ContributionSubmitted);
