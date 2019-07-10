import React from "react";
import Button from "../../Button/Button";
import ContributionSubmittedForm from "./ContributionSubmittedForm.js";
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
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const addressContainer = css`
  width: 96%%;
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
    margin-top: 0px;
  `,
  subheading: css`
    font-family: SofiaProRegular;
    font-size: 16px;
    line-height: 19px;
    margin-top: 0px;
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
    justify-content: flex-end;
    flex-direction: column;
    margin-right: 38px;
    margin-bottom: 13px;
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
  margin-top: 65px;
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
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.65);
`;

const sectionValues = css`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
  height: 25px;
  /* identical to box height */
  color: #333333;
  margin-top: 14px;
  margin-bottom: 22px;
`;

// HEADER PIECES
const invoiceNumber = "#10000023456";
const campaignName = "FakeName";
const lastEdited = "date";
const currentStatus = "Submitted";
const labelsCount = 0;
const addALabel = "";

const ContributionSubmitted = () => (
  <>
    <React.Fragment>
      {/* HEADER SECTION */}
      <div css={headerStyles.header}>
        <div css={headerStyles.leftColumn}>
          <div style={{ display: "flex" }}>
            <p css={headerStyles.invoice}>←</p>
            <div style={{ marginLeft: "20px" }}>
              <p css={headerStyles.invoice}> {invoiceNumber}</p>
              {/* placeholder for arrow ^ */}
              <div css={headerStyles.subheading}>
                <p style={{ marginTop: "0px" }}>
                  {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
                </p>
              </div>
            </div>
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
                Jump to Activity ↓
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
    </React.Fragment>
    <ContributionSubmittedForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        // basics values
        dateOfContribution: "09/09/2019", // Date.now(), // FORMAT?
        typeOfContribution: "Contribution",
        subTypeOfContribution: "In-Kind Contribution",
        typeOfContributor: "Individual",
        amountOfContribution: undefined,
        oaeContributionType: "Matchable",
        paymentMethod: "Check",
        checkNumber: undefined,

        // contributor alues
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
        employerZipcode: "97212",

        // other details values
        electionAggregate: "2019",
        description: "Some Description",
        occupationLetterDate: "",
        linkToDocumentation: "",
        notes: ""
      }}
    >
      {({ formFields, isValid, handleSubmit /* isDirty, isSubmitting */ }) => (
        <React.Fragment>
          <hr style={{ marginRight: "38px" }} />

          {/* BASICS SECTION */}
          <div css={sectionStyles}>
            <h3 css={sectionTitle}>Basics</h3>
            <div css={container}>
              <h2>{formFields.dateOfContribution}</h2>
              <h2>{formFields.typeOfContribution}</h2>
              <h2>{formFields.subTypeOfContribution}</h2>
              <h2>{formFields.typeOfContributor}</h2>
              <h2>{formFields.amountOfContribution}</h2>
              <h2>{formFields.oaeContributionType}</h2>
              <h2>{formFields.paymentMethod}</h2>
              <h2>{formFields.checkNumber}</h2>
            </div>
          </div>

          {/* CONTRIBUTOR SECTION */}
          <div css={sectionStyles}>
            <h3 css={sectionTitle}>Contributor</h3>
            <div css={contributorContainer}>
              <h2>{formFields.firstName}</h2>
              <h2>{formFields.lastName}</h2>
            </div>
            <h2 css={addressContainer}>{formFields.streetAddress}</h2>
            <h2 css={addressContainer}>{formFields.addressLine2}</h2>
            <div css={cityStateZip}>
              <h2>{formFields.city}</h2>
              <h2>{formFields.state}</h2>
              <h2>{formFields.zipcode}</h2>
            </div>
            <div css={contributorContainer}>
              <h2>{formFields.contactType}</h2>
              <h2>{formFields.contactInformation}</h2>
              <h2>{formFields.occupation}</h2>
              <h2>{formFields.employerName}</h2>
            </div>
            <div css={cityStateZip}>
              <h2>{formFields.employerCity}</h2>
              <h2>{formFields.employerState}</h2>
              <h2>{formFields.employerZipcode}</h2>
            </div>
          </div>

          {/* OTHER DETAILS SECTION */}
          <div css={sectionStyles}>
            <h3 css={sectionTitle}>Other Details</h3>
            <div css={container}>
              <h2>{formFields.electionAggregate}</h2>
              <h2>{formFields.description}</h2>
              <h2>{formFields.occupationLetterDate}</h2>
              <h2>{formFields.linkToDocumentation}</h2>
              <h2>{formFields.notes}</h2>
            </div>
          </div>
        </React.Fragment>
      )}
    </ContributionSubmittedForm>
  </>
);
export default connect(state => ({
  isLoggedIn: isLoggedIn(state) || false
}))(ContributionSubmitted);
