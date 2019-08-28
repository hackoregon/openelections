import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { format } from 'date-fns';
import { ContributionStatusEnum } from '../../../../api/api';
import Button from '../../../../components/Button/Button';

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
  `,
  sectionTwo: css`
    display: grid;
    width: 100%;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
  `,
  fullWidth: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: 1fr;
    grid-gap: 20px;
\  `,
  cityStateZip: css`
    width: 100%;
    min-height: 25px;
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
    grid-template-columns: 2fr 1fr 1fr;
    grid-gap: 20px;
  `,
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
    background-color: #42b44a;
    border-radius: 5px;
    color: white;
    width: 225px;
    height: 50px;
    margin: 5px;
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
  `,
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
  `,
};
const buttonBar = {
  wrapper: css`
    position: relative;
  `,
  container: css`
    position: absolute;
    right: 0;
    bottom: 0;
  `,
  button: css`
    margin: 1px;
  `,
};
// TODO: make a separate component for this checkmark component, find out what it indicates?
const CheckmarkComponent = ({}) => (
  <p
    css={css`
      margin-right: 8px;
    `}
  >
    {' '}
    ✅
  </p>
);

export const ViewHeaderSection = ({
  isValid,
  handleSubmit,
  id,
  updatedAt,
  status,
  formValues,
  isCampAdmin,
  isCampStaff,
}) => (
  <>
    <div css={containers.header}>
      <div>
        <p css={headerStyles.invoice}>
          #{id} {status}
        </p>
        <p css={headerStyles.subheading}>
          Campaign | {`Last Edited ${updatedAt}`}
        </p>
      </div>
      <div css={buttonBar.wrapper}>
        <div css={buttonBar.container}>
          {status === ContributionStatusEnum.DRAFT ? (
            <>
              {isCampStaff || isCampAdmin ? (
                <>
                  <Button
                    css={headerStyles.submitButton}
                    style={{ margin: 1 }}
                    buttonType="submit"
                    onClick={() => {
                      formValues.buttonSubmitted = 'archive';
                      handleSubmit();
                    }}
                  >
                    Archive
                  </Button>
                  <Button
                    css={headerStyles.submitButton}
                    style={{ margin: 1 }}
                    buttonType="submit"
                    onClick={() => {
                      formValues.buttonSubmitted = 'save';
                      handleSubmit();
                    }}
                  >
                    Save
                  </Button>
                </>
              ) : null}
              {isCampAdmin ? (
                <Button
                  css={headerStyles.submitButton}
                  style={{ margin: 1 }}
                  buttonType="submit"
                  onClick={() => {
                    formValues.buttonSubmitted = 'submit';
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              ) : null}
            </>
          ) : null}
          {status === ContributionStatusEnum.ARCHIVED &&
          (isCampStaff || isCampAdmin) ? (
            <Button
              css={headerStyles.submitButton}
              buttonType="submit"
              onClick={() => {
                formValues.buttonSubmitted = 'move_to_draft';
                handleSubmit();
              }}
            >
              Move to Draft
            </Button>
          ) : null}
        </div>
      </div>
    </div>
    <hr css={sectionStyles.dividerLine} />
  </>
);

export const AddHeaderSection = ({ isValid, handleSubmit }) => (
  <>
    <div css={containers.header}>
      <div style={{ flexDirection: 'column' }}>
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
);

export const BasicsSection = ({
  formFields,
  checkSelected,
  showInKindFields,
  isSubmited,
  showPaymentMethod,
}) => (
  <div style={isSubmited ? { pointerEvents: 'none', opacity: '0.7' } : null}>
    <div css={sectionStyles.main}>
      <h3 css={sectionStyles.title}>Basics</h3>
      <div css={containers.main}>
        <h2>{formFields.dateOfContribution}</h2>
        <h2>{formFields.typeOfContribution}</h2>
        <h2>{formFields.subTypeOfContribution}</h2>
        <h2>{formFields.amountOfContribution}</h2>
        <h2>{formFields.oaeType}</h2>
        <h2>{formFields.submitForMatch}</h2>
        {showInKindFields ? <h2>{formFields.inKindType}</h2> : null}
        {showPaymentMethod ? <h2>{formFields.paymentMethod}</h2> : null}
        {checkSelected && !showInKindFields ? (
          <h2>{formFields.checkNumber}</h2>
        ) : null}
      </div>
    </div>
  </div>
);

export const ContributorSection = ({
  formFields,
  showEmployerSection,
  isPerson,
  emptyOccupationLetterDate,
  isSubmited,
}) => (
  <div style={isSubmited ? { pointerEvents: 'none', opacity: '0.7' } : null}>
    <div css={sectionStyles.main}>
      <h3 css={sectionStyles.title}>Contributor</h3>
      <div css={containers.sectionTwo}>
        <h2>{formFields.typeOfContributor}</h2>
        {isPerson ? (
          <>
            <h2>{formFields.firstName}</h2>
            <h2>{formFields.lastName}</h2>
          </>
        ) : (
          <h2>{formFields.entityName}</h2>
        )}
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
        {isPerson ? <h2>{formFields.occupation}</h2> : null}
      </div>
      {isPerson ? (
        <div css={containers.cityStateZip}>
          {showEmployerSection ? (
            <>
              {emptyOccupationLetterDate ? (
                <>
                  <h2 css={containers.fullWidth}>{formFields.employerName}</h2>
                  <h2>{formFields.employerCity}</h2>
                  <h2>{formFields.employerState}</h2>
                  {/* <h2>{formFields.employerZipcode}</h2> */}
                </>
              ) : null}
              <h2 css={containers.fullWidth}>
                {formFields.occupationLetterDate}
              </h2>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  </div>
);

export const OtherDetailsSection = ({
  formFields,
  formValues,
  handleSubmit,
}) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Other Details</h3>
    <div css={containers.main}>
      {/* <h2>{formFields.electionAggregate}</h2>
      <h2>{formFields.description}</h2> */}
      <h2>{formFields.linkToDocumentation}</h2>
      <h2>{formFields.notes}</h2>
      <div css={containers.header}>
        <Button
          css={headerStyles.submitButton}
          buttonType="submit"
          onClick={() => {
            formValues.buttonSubmitted = 'submit';
            handleSubmit();
          }}
        >
          Save other details
        </Button>
      </div>
    </div>
  </div>
);
