import React from "react";
import Button from '../../../../components/Button/Button';
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const containers = {
  header: css`
    width: 96%%;
    min-height: 100%;
    display: grid;
    grid-template-rows: repeat(auto-fit(15px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 20px;
    margin-right: 38px;
  `,
  main: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  sectionTwo: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  fullWidth: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: 1fr;
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  cityStateZip: css`
    width: 96%%;
    min-height: 25px;
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
    grid-template-columns: 2fr 22% 24%;
    grid-gap: 20px;
    margin-bottom: 20px;
  `
};

const headerStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
    margin-right: 38px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  leftColumn: css`
    margin-right: 70px;
  `,
  rightColumn: css`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  `,
  invoice: css`
    font-size: 48px;
    line-height: 57px;
    margin: 0px;
    /* identical to box height */
    color: #333333;
  `,
  subheading: css`
    font-size: 16px;
    line-height: 19px;
    margin-top: 0px;
    width: 360px;
  `,
  labelBlock: css`
    margin-right: 40px;
  `,
  labels: css`
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  smallBlueText: css`
    font-size: 13px;
    line-height: 15px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  largerBlueText: css`
    font-size: 16px;
    line-height: 19px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  status: css`
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  actualStatus: css`
    font-size: 21px;
    line-height: 25px;
    color: #000000;
    margin-top: 0px;
    margin-bottom: 20px;
  `,
  statusBlock: css`
    flex-direction: column;
    align-items: left;
  `,
  buttonDiv: css`
    display: flex;
    justify-content: space-between;
    align-self: flex-end;
  `,
  submitButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
  `,
  draftButton: css`
    // HAVING ZERO IMPACT
    background-color: #5f5fff;
    border-radius: 5px;
    width: 165px;
    height: 50px;
  `
};

const sectionStyles = {
  main: css`
    margin-right: 34px;
    margin-bottom: 34px;
    margin-top: 34px;
  `,
  dividerLine: css`
    margin-left: -20px;
  `,
  title: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    width: 100%;
    color: #000000;
    margin-top: 55px;
  `,
  notes: css`
    margin-top: 75px;
  `
};

// HEADER VALUES
const invoiceNumber = "#1030090212";
const campaignName = "FakeName";
const lastEdited = "09/09/2019"; // NEEDS TO BE ACTUAL DATE
const currentStatus = "Draft";
const labelsCount = 0;

const InvoiceNumberBlock = () => (
  <>
    <p css={headerStyles.invoice}>{invoiceNumber}</p>
    <p css={headerStyles.subheading}>
      {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
    </p>
  </>
);

const StatusBlock = () => (
  <div css={headerStyles.statusBlock}>
    <p css={headerStyles.status}>Current Status</p>
    <p css={headerStyles.actualStatus}>{currentStatus}</p>
  </div>
);

const LabelBlock = () => (
  <div css={headerStyles.labelBlock}>
    <p css={headerStyles.labels}>{`Labels (${labelsCount})`}</p>
    <p css={headerStyles.smallBlueText}>+ Add Labels</p>
  </div>
);

export const HeaderSection = ({ isValid, handleSubmit }) => (
  <>
    <div css={containers.header}>
      <div css={headerStyles.leftColumn}>
        <InvoiceNumberBlock />
        <div style={{ display: "flex" }}>
          <LabelBlock />
        </div>
      </div>
      <div css={headerStyles.rightColumn}>
        <div style={{ flexDirection: "column" }}>
          <StatusBlock />
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
    </div>
    <hr css={sectionStyles.dividerLine} />
  </>
)

export const BasicsSection = ({ formFields }) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Basics</h3>
    <div css={containers.main}>
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
)

export const ContributorSection = ({ formFields }) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Contributor</h3>
    <div css={containers.sectionTwo}>
      <h2>{formFields.firstName}</h2>
      <h2>{formFields.lastNameOrEntity}</h2>
    </div>
    <h2 css={containers.fullWidth}>{formFields.streetAddress}</h2>
    <h2 css={containers.fullWidth}>{formFields.addressLine2}</h2>
    <div css={containers.cityStateZip}>
      <h2>{formFields.city}</h2>
      <h2>{formFields.state}</h2>
      <h2>{formFields.zipcode}</h2>
    </div>
    <div css={containers.sectionTwo}>
      <h2>{formFields.contactType}</h2>
      <h2>{formFields.contactInformation}</h2>
      <h2>{formFields.occupation}</h2>
      <h2>{formFields.employerName}</h2>
    </div>
    <div css={containers.cityStateZip}>
      <h2>{formFields.employerCity}</h2>
      <h2>{formFields.employerState}</h2>
      <h2>{formFields.employerZipcode}</h2>
    </div>
    <h2 css={containers.fullWidth}>{formFields.occupationLetterDate}</h2>
  </div>
)

export const OtherDetailsSection = ({ formFields }) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Other Details</h3>
    <div css={containers.main}>
      <h2>{formFields.electionAggregate}</h2>
      <h2>{formFields.description}</h2>
      <h2>{formFields.linkToDocumentation}</h2>
      <h2>{formFields.notes}</h2>
    </div>
  </div>
)
