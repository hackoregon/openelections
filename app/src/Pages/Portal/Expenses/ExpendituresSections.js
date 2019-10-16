import React from 'react'; // eslint-disable-line no-unused-vars
/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
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
  handleSubmit,
  id,
  updatedAt,
  status,
  formValues,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
  campaignName,
  history,
  isGovAdminAuthenticated,
  statusText = status.replace(/_/g, ' '),
  AssumeButton,
  isAssumed,
}) => {
  function SaveButton({
    text = 'Save',
    action = 'save',
    styleType = 'submit',
  }) {
    return (
      <Button
        css={headerStyles.submitButton}
        style={{ margin: 1 }}
        buttonType={styleType}
        onClick={() => {
          formValues.buttonSubmitted = action;
          handleSubmit();
        }}
      >
        {text}
      </Button>
    );
  }
  SaveButton.propTypes = {
    text: PropTypes.string,
    action: PropTypes.string,
    styleType: PropTypes.string,
  };

  return (
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
                    <SaveButton text="Archive" action="archive" />
                    <SaveButton />
                  </>
                ) : null}

                {isCampAdmin ? (
                  <SaveButton text="Submit" action="submit" />
                ) : null}
              </>
            ) : null}
            {status === ExpenditureStatusEnum.ARCHIVED &&
            (isCampStaff || isCampAdmin) ? (
              <SaveButton text="Move to Draft" action="move_to_draft" />
            ) : null}
            {status === ExpenditureStatusEnum.SUBMITTED &&
            (isCampStaff || isCampAdmin) ? (
              <SaveButton text="Archive" action="archive" />
            ) : null}
          </div>
        </div>
      </div>
      <hr css={sectionStyles.dividerLine} />
      <div css={headerStyles.buttonDiv}>
        <div />
        <div>
          {' '}
          <AssumeButton />
          {isAssumed ? (
            <SaveButton text="Save" action="save" styleType="red" />
          ) : null}
        </div>
      </div>
      {!isGovAdminAuthenticated ? (
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            css={headerStyles.submitButton}
            buttonType="green"
            onClick={() => history.push({ pathname: '/expenses/new' })}
          >
            Add New Expense
          </Button>
        </div>
      ) : null}
    </>
  );
};

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
  showOriginalDateAndVendor,
  showPurposeType,
  showCompliant,
}) => (
  <>
    {showCompliant === 'in_compliance' ? (
      <p style={{ margin: '0px', color: 'green' }}>Compliant</p>
    ) : null}
    <div>
      <h3 css={sectionStyles.title}>Basics</h3>
      <div css={containers.fullWidth}>
        <div css={containers.halfWidth}>
          <h2>{formFields.amount}</h2>
          <h2>{formFields.date}</h2>
        </div>
      </div>
      <div css={containers.halfWidth}>
        <h2>{formFields.expenditureType}</h2>
        <h2>{formFields.expenditureSubType}</h2>
        {showOriginalDateAndVendor ? (
          <>
            <h2>{formFields.dateOriginalTransaction}</h2>
            <h2>{formFields.vendorForOriginalPurchase}</h2>
          </>
        ) : null}
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
    <div>
      <h3 css={sectionStyles.title}>Payee Information</h3>
      <div css={containers.halfWidth}>
        <h2>{formFields.payeeType}</h2>
        <h2>{formFields.payeeName}</h2>
      </div>
      <h2 css={containers.fullWidth}>{formFields.streetAddress}</h2>
      <h2 css={containers.fullWidth}>{formFields.addressLine2}</h2>
      <div css={containers.cityStateZip}>
        <h2>{formFields.city}</h2>
        <h2>{formFields.state}</h2>
        <h2>{formFields.zipcode}</h2>
      </div>
    </div>
    <div>
      <h2 css={[containers.fullWidth, sectionStyles.notes]}>
        {formFields.notes}
      </h2>
    </div>
  </>
);

export const AddFooterSection = ({ isValid, handleSubmit }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row-reverse',
      marginBottom: '40px',
    }}
  >
    <Button
      css={headerStyles.submitButton}
      buttonType="submit"
      disabled={!isValid}
      onClick={handleSubmit}
    >
      Save as Draft
    </Button>
  </div>
);

ViewHeaderSection.propTypes = {
  handleSubmit: PropTypes.func,
  id: PropTypes.number,
  updatedAt: PropTypes.string,
  status: PropTypes.string,
  formValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isGovAdmin: PropTypes.bool,
  isCampAdmin: PropTypes.bool,
  isCampStaff: PropTypes.bool,
  campaignName: PropTypes.string,
  history: PropTypes.oneOfType([PropTypes.object]),
  isGovAdminAuthenticated: PropTypes.bool,
  statusText: PropTypes.string,
  AssumeButton: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isAssumed: PropTypes.bool,
};

AddHeaderSection.propTypes = {
  handleSubmit: PropTypes.func,
  isValid: PropTypes.bool,
};

BasicsSection.propTypes = {
  formFields: PropTypes.oneOfType([PropTypes.object]),
  checkSelected: PropTypes.bool,
  showPaymentMethod: PropTypes.bool,
  showOriginalDateAndVendor: PropTypes.bool,
  showPurposeType: PropTypes.bool,
  showCompliant: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

PayeeInfoSection.propTypes = {
  formFields: PropTypes.oneOfType([PropTypes.object]),
};

AddFooterSection.propTypes = {
  handleSubmit: PropTypes.func,
  isValid: PropTypes.bool,
};
