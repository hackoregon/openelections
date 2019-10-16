import React from 'react'; // eslint-disable-line no-unused-vars
/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { ContributionStatusEnum } from '../../../../api/api';
import Button from '../../../../components/Button/Button';
import {
  containers,
  headerStyles,
  sectionStyles,
  buttonBar,
} from '../../../../assets/styles/forms.styles';
import { MatchPickerHeader } from '../../../../components/ContributorMatchPicker';
import MatchContributionSelector from '../../../../components/Forms/MatchContribution/MatchContributionSelector';
import { AssumeButton } from '../../../../components/Assume';

export const ViewHeaderSection = ({
  handleSubmit,
  id,
  updatedAt,
  status,
  formValues,
  isGovAdmin,
  isGovAdminAuthenticated,
  isCampAdmin,
  isCampStaff,
  campaignName,
  history,
  isAssumed,
}) => {
  let showMatchOption = null;
  const showMatchableSelector = () => {
    if (isGovAdmin) {
      if (
        formValues.typeOfContributor === 'individual' &&
        status !== 'Archived' &&
        status !== 'Draft' &&
        status !== 'Processed' &&
        status !== 'Out of compliance' &&
        (formValues.oaeType === 'matchable' ||
          formValues.oaeType === 'qualifying')
      ) {
        return (showMatchOption = 'show');
      }
      return (showMatchOption = 'hide');
    }
    return showMatchOption;
  };

  showMatchableSelector();

  return (
    <>
      <div css={containers.header}>
        <div>
          <p css={headerStyles.invoice}>
            #{id} {status}
          </p>
          <p css={headerStyles.subheadingWide}>
            {`${campaignName} | Last Edited ${updatedAt}`}
          </p>
        </div>
        <div css={buttonBar.wrapper}>
          <div css={buttonBar.container}>
            {showMatchOption === 'show' || showMatchOption === 'hide' ? (
              <MatchContributionSelector
                id={id}
                donationAmount={formValues.amountOfContribution}
                showMatchOption={showMatchOption}
              />
            ) : null}
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
                      Move to trash
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
                      Save Draft
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
            {status === ContributionStatusEnum.SUBMITTED &&
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
      <AssumeButton />
      {isAssumed ? (
        <Button
          css={headerStyles.submitButton}
          style={{ margin: 1 }}
          buttonType="red"
          onClick={() => {
            formValues.buttonSubmitted = 'save';
            handleSubmit();
          }}
        >
          Save
        </Button>
      ) : null}
      {!isGovAdminAuthenticated ? (
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            css={headerStyles.submitButton}
            buttonType="green"
            onClick={() => history.push({ pathname: '/contributions/add' })}
          >
            Add New Contribution
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const AddHeaderSection = ({ isValid, handleSubmit }) => (
  <>
    <h1>New Contribution</h1>
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
  showInKindFields,
  showPaymentMethod,
  showMatchAmount,
  showCompliant,
}) => (
  <div>
    {showCompliant ? (
      <p style={{ margin: '0px', color: 'green' }}>Compliant</p>
    ) : null}
    {showMatchAmount ? (
      <p style={{ margin: '0px' }}>{`Match Amount: $${showMatchAmount}`}</p>
    ) : null}
    <div>
      <h3 css={sectionStyles.title}>Basics</h3>
      <div css={containers.halfWidth}>
        <h2>{formFields.dateOfContribution}</h2>
        <h2>{formFields.typeOfContribution}</h2>
      </div>
      <div css={containers.halfWidth}>
        <h2>{formFields.subTypeOfContribution}</h2>
        <h2>{formFields.amountOfContribution}</h2>
      </div>
      <div css={containers.halfWidth}>
        <h2>{formFields.oaeType}</h2>
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
  isGovAdmin,
  contributionId,
  showOccupationLetter,
  matchId,
}) => (
  <div>
    {isPerson && isGovAdmin ? (
      <div>
        <MatchPickerHeader
          form="MatchPickerForm"
          contributionId={contributionId}
          currentMatchId={matchId}
        />
      </div>
    ) : (
      <h3 css={sectionStyles.title}>Contributor</h3>
    )}
    <h2 css={containers.fullWidth}>{formFields.typeOfContributor}</h2>
    {isPerson ? (
      <div css={containers.halfWidth}>
        <h2>{formFields.firstName}</h2>
        <h2>{formFields.lastName}</h2>
      </div>
    ) : (
      <h2 css={containers.fullWidth}>{formFields.entityName}</h2>
    )}
    <h2 css={containers.fullWidth}>{formFields.streetAddress}</h2>
    <h2 css={containers.fullWidth}>{formFields.addressLine2}</h2>
    <div css={containers.cityStateZip}>
      <h2>{formFields.city}</h2>
      <h2>{formFields.state}</h2>
      <h2>{formFields.zipcode}</h2>
    </div>
    <h2 css={containers.fullWidth}>{formFields.email}</h2>
    <div css={containers.halfWidth}>
      <h2>{formFields.phone}</h2>
      <h2>{formFields.phoneType}</h2>
    </div>
    {isPerson ? (
      <div>
        <div css={containers.halfWidth}>
          <h2>{formFields.occupation}</h2>
          {showOccupationLetter ? (
            <h2>{formFields.occupationLetterDate}</h2>
          ) : null}
        </div>
        <div css={containers.fullWidth}>
          {showEmployerSection ? (
            <>
              {emptyOccupationLetterDate ? (
                <div css={containers.employerStateZip}>
                  <h2>{formFields.employerName}</h2>
                  <h2>{formFields.employerCity}</h2>
                  <h2>{formFields.employerState}</h2>
                  <h2>{formFields.employerCountry}</h2>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
        <div>
          <h2 css={sectionStyles.notes}>{formFields.notes}</h2>
        </div>{' '}
      </div>
    ) : null}
  </div>
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

ContributorSection.propTypes = {
  formFields: PropTypes.oneOfType([PropTypes.object]),
  showEmployerSection: PropTypes.bool,
  isPerson: PropTypes.bool,
  emptyOccupationLetterDate: PropTypes.bool,
  isGovAdmin: PropTypes.bool,
  contributionId: PropTypes.number,
  showOccupationLetter: PropTypes.bool,
  matchId: PropTypes.string,
};
ViewHeaderSection.propTypes = {
  isAssumed: PropTypes.bool,
  handleSubmit: PropTypes.func,
  id: PropTypes.bool,
  updatedAt: PropTypes.string,
  status: PropTypes.string,
  formValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isGovAdmin: PropTypes.bool,
  isCampAdmin: PropTypes.bool,
  isCampStaff: PropTypes.bool,
  campaignName: PropTypes.string,
  history: PropTypes.oneOfType([PropTypes.object]),
  isGovAdminAuthenticated: PropTypes.bool,
};

AddHeaderSection.propTypes = {
  handleSubmit: PropTypes.func,
  isValid: PropTypes.bool,
};

BasicsSection.propTypes = {
  showInKindFields: PropTypes.bool,
  showMatchAmount: PropTypes.bool,
  formFields: PropTypes.oneOfType([PropTypes.object]),
  checkSelected: PropTypes.bool,
  showPaymentMethod: PropTypes.bool,
  showCompliant: PropTypes.bool,
};

AddFooterSection.propTypes = {
  handleSubmit: PropTypes.func,
  isValid: PropTypes.bool,
};
