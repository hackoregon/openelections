import React from "react";
import Button from '../../../../components/Button/Button';
/** @jsx jsx */
import { ContributionStatusEnum } from '../../../../api/api';
import { text } from '@storybook/addon-knobs';
import { css, jsx } from "@emotion/core";
import { format } from "date-fns"

const containers = {
  header: css`
    width: 96%;
    min-height: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
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
    width: 96%;
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
  // labelBlock: css`
  //   margin-right: 40px;
  // `,
  // labels: css`
  //   font-size: 13px;
  //   line-height: 15px;
  //   color: #979797;
  //   margin-bottom: 4px;
  // `,
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
    background-color: #42B44A;
    border-radius: 5px;
    color: white;
    width: 225px;
    height: 50px;
  `,
  draftButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
    margin-right: 8px !important;
  `,
  trashButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
    margin-right: 8px !important;
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
const invoiceNumber = "#1030090212"; // TODO: Where is this invoice number coming from/generated? 
const currentStatus = "Draft";
// const labelsCount = 0;

const InvoiceNumberBlock = ({ campaignName, lastEdited }) => (
  <>
    <p css={headerStyles.invoice}>{invoiceNumber}</p>
    <p css={headerStyles.subheading}>
      {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
    </p>
  </>
);

const StatusBlock = ({ status }) => (
  <div css={headerStyles.statusBlock}>
    <p css={headerStyles.status}>Current Status</p>
    <p css={headerStyles.actualStatus}>{status}</p>
  </div>
);

// const LabelBlock = ({ labelsCount }) => (
//   <div css={headerStyles.labelBlock}>
//     <p css={headerStyles.labels}>{`Labels (${labelsCount})`}</p>
//     <p css={headerStyles.smallBlueText}>+ Add Labels</p>
//   </div>
// );

// TODO: make a separate component for this checkmark component, find out what it indicates?
const CheckmarkComponent = ({}) => (
  <p css={css`margin-right: 8px;`}> ✅</p>
)

const setButtonText = (status) => {
  const configs = {}
  switch (status) {
    case ContributionStatusEnum.DRAFT:
      configs.archive = "Archive"
      configs.draft = "Draft"
      configs.submit = "Submit"
      break
    case ContributionStatusEnum.ARCHIVED:
      configs.draft = "Move to Draft"
    case ContributionStatusEnum.PROCESSED:
    case ContributionStatusEnum.SUBMITTED:
    default:
      return configs
  }
  return configs
}

const createHeaderButton = (style, onClick, text, disabled = false) => (
  <Button
    style={style}
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </Button>
)

export const ReadyHeaderSection = ({
  status,
  campaignName,
  lastEdited,
  // labelsCount,
  isValid,
  handleSubmit,
  handleTrash,
  handleDraft
}) => {
  const { archive, draft, submit } = setButtonText(status)
  return (
    <>
      <div css={containers.header}>
        <div css={headerStyles.leftColumn}>
          <InvoiceNumberBlock
            campaignName={campaignName}
            lastEdited={format(new Date(lastEdited), 'mm/DD/yyyy')}
          />
          <div style={{ display: "flex" }}>
            <StatusBlock status={status} />
          </div>
        </div>
        <div css={headerStyles.rightColumn}>
          <div style={{ display: "flex", height: "50px" }}>
            {archive ? createHeaderButton(headerStyles.trashButton, handleTrash, archive) : null}
            {draft ? createHeaderButton(headerStyles.draftButton, handleDraft, draft) : null}
            {draft && submit ? <CheckmarkComponent/> : null}
            {submit ? createHeaderButton(headerStyles.submitButton, handleSubmit, submit, !isValid) : null}
          </div>
        </div>
      </div>
      <hr css={sectionStyles.dividerLine} />
    </>
  )
}

export const AddHeaderSection = ({ isValid, handleSubmit }) => (
  <>
    <div css={containers.header}>
        <div style={{ flexDirection: "column" }}>
          <Button
            css={headerStyles.submitButton}
            buttonType="submit"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Save as Draft
        </Button>
        </div>
      </div>
    <hr css={sectionStyles.dividerLine} />
  </>
)

export const BasicsSection = ({ formFields, checkSelected }) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Basics</h3>
    <div css={containers.main}>
      <h2>{formFields.dateOfContribution}</h2>
      <h2>{formFields.typeOfContribution}</h2>
      <h2>{formFields.subTypeOfContribution}</h2>
      <h2>{formFields.typeOfContributor}</h2>
      <h2>{formFields.amountOfContribution}</h2>
      <h2>{formFields.submitForMatch}</h2>
      <h2>{formFields.paymentMethod}</h2>
      {checkSelected ? <h2>{formFields.checkNumber}</h2> : null}
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
      <h2>{formFields.email}</h2>
      <h2>{formFields.phone}</h2>
      <h2>{formFields.phoneType}</h2>
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
