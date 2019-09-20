import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ExpenditureStatusEnum } from '../../../api/api';
import Button from '../../../components/Button/Button';
import {
  containers,
  headerStyles,
  sectionStyles,
  buttonBar,
} from '../../../assets/styles/forms.styles';
import ComplianceSelectButton from '../../../components/Forms/ComplianceReason/ComplianceSelectButton';

export const ViewHeaderSection = ({
  isValid,
  handleSubmit,
  id,
  updatedAt,
  status,
  formValues,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
  campaignName,
  statusText = status.replace(/_/g, ' '),
}) => (
  <>
    <div css={containers.header}>
      <div>
        <p css={headerStyles.invoice}>
          #{id}{' '}
          <span style={{ textTransform: 'capitalize' }}>{statusText}</span>
        </p>
        <p css={headerStyles.subheadingWide}>
          {`${campaignName} | Last Edited ${updatedAt}`}
        </p>
      </div>
      <div css={buttonBar.wrapper}>
        <div css={buttonBar.container}>
          {isGovAdmin ? <ComplianceSelectButton id={id} /> : null}
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
          {status === ExpenditureStatusEnum.SUBMITTED &&
          (isCampStaff || isCampAdmin) ? (
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
          ) : null}
        </div>
      </div>
    </div>
    <hr css={sectionStyles.dividerLine} />
  </>
);

export const AddHeaderSection = ({ isValid, handleSubmit }) => (
  <>
    <h1 style={{ fontFamily: "Poppins',sans-serif" }}>New Expense</h1>
    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <Button
        css={headerStyles.submitButton}
        buttonType="submit"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        Save as Draft
      </Button>
    </div>
    <hr css={sectionStyles.dividerLine} />
  </>
);

export const BasicsSection = ({
  formFields,
  checkSelected,
  showPaymentMethod,
  showPurposeType,
  showCompliant,
}) => (
  <>
    {showCompliant === 'in_compliance' ? (
      <p style={{ margin: '0px', color: 'green' }}>Compliant</p>
    ) : null}
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
  </>
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
