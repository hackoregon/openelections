import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ExpenditureStatusEnum } from '../../../api/api';
import Button from '../../../components/Button/Button';

const containers = {
  header: css`
    width: 96%%;
    min-height: 100%;
    display: grid;
    grid-template-rows: repeat(auto-fit(15px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 20px;
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
    margin: 0px;
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
export const ViewHeaderSection = ({
  isValid,
  handleSubmit,
  id,
  updatedAt,
  status,
  formValues,
  isCampAdmin,
  isCampStaff,
  campaignName,
}) => (
  <>
    <div css={containers.header}>
      <div>
        <p css={headerStyles.invoice}>
          #{id} {status}
        </p>
        <p css={headerStyles.subheading}>
          {`${campaignName} | Last Edited ${updatedAt}`}
        </p>
      </div>
      <div css={buttonBar.wrapper}>
        <div css={buttonBar.container}>
          {status === ExpenditureStatusEnum.DRAFT ? (
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
          {status === ExpenditureStatusEnum.ARCHIVED &&
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
  showPaymentMethod,
  showPurposeType,
}) => (
  <div css={sectionStyles.main}>
    <h3 css={sectionStyles.title}>Basics</h3>
    <div css={containers.main}>
      <h2>{formFields.amount}</h2>
      <h2>{formFields.date}</h2>
      <h2>{formFields.expenditureType}</h2>
      <h2>{formFields.expenditureSubType}</h2>
      {showPaymentMethod ? <h2>{formFields.paymentMethod}</h2> : null}
      {checkSelected ? <h2>{formFields.checkNumber}</h2> : null}
    </div>
    {showPurposeType ? (
      <h2 css={containers.fullWidth}>{formFields.purposeType}</h2>
    ) : null}
  </div>
);

export const PayeeInfoSection = ({ formFields }) => (
  <>
    <div css={sectionStyles.main}>
      <h3 css={sectionStyles.title}>Payee Information</h3>
      <div css={containers.sectionTwo}>
        <h2>{formFields.payeeType}</h2>
        <h2>{formFields.payeeName}</h2>
      </div>
      <h2 css={containers.fullWidth}>{formFields.streetAddress}</h2>
      <h2 css={containers.fullWidth}>{formFields.addressLine2}</h2>
      <div css={containers.cityStateZip}>
        <h2>{formFields.city}</h2>
        <h2>{formFields.state}</h2>
      </div>
      <div css={containers.sectionTwo}>
        <h2>{formFields.zipcode}</h2>
      </div>
    </div>
    <div css={sectionStyles.main}>
      <h2 css={[containers.fullWidth, sectionStyles.notes]}>
        {formFields.notes}
      </h2>
    </div>
  </>
);
