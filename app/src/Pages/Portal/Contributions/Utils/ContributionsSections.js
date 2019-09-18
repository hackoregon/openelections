import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { format } from 'date-fns';
import { ContributionStatusEnum } from '../../../../api/api';
import Button from '../../../../components/Button/Button';
import {
  containers,
  headerStyles,
  sectionStyles,
  buttonBar,
} from '../../../../assets/styles/forms.styles';
import { MatchPickerHeader } from '../../../../components/MatchPicker/MatchPicker';
import MatchContributionSelector from '../../../../components/Forms/MatchContribution/MatchContributionSelector';

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
}) => {
  let showMatchOption = null;
  const showMatchableSelector = () => {
    if (isGovAdmin) {
      if (
        formValues.typeOfContributor === 'individual' &&
        status !== 'Archived' &&
        status !== 'Draft' &&
        status !== 'Processed' &&
        status !== 'Out of compliance' && // compliant is not false?
        formValues.oaeType === 'matchable'
      ) {
        return (showMatchOption = 'show');
      }
      return (showMatchOption = 'hide');
    }
    return showMatchOption;
  };

  showMatchableSelector();
  console.log('in the selector: ', showMatchOption);

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
  isGovAdmin,
  contributionId,
  showOccupationLetter,
}) => (
  <div style={isSubmited ? { pointerEvents: 'none', opacity: '0.7' } : null}>
    <div css={sectionStyles.main}>
      {/* TODO Remove false when match endpoints are hooked up */}
      {isPerson && isGovAdmin && false ? (
        <MatchPickerHeader
          form="MatchPickerForm"
          contributionId={contributionId}
        />
      ) : (
        <h3 css={sectionStyles.title}>Contributor</h3>
      )}
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
      </div>
      {isPerson ? (
        <div>
          <div css={containers.sectionTwo} style={{ marginTop: '25px' }}>
            <h2>{formFields.occupation}</h2>
            {showOccupationLetter ? (
              <h2>{formFields.occupationLetterDate}</h2>
            ) : null}
          </div>
          <div css={containers.cityStateZip}>
            {showEmployerSection ? (
              <>
                {emptyOccupationLetterDate ? (
                  <>
                    <h2 css={containers.fullWidth}>
                      {formFields.employerName}
                    </h2>
                    <h2>{formFields.employerCity}</h2>
                    <h2>{formFields.employerState}</h2>
                    {/* <h2>{formFields.employerZipcode}</h2> */}
                  </>
                ) : null}
              </>
            ) : null}
          </div>
          <div css={sectionStyles.main}>
            <h2 css={[containers.fullWidth, sectionStyles.notes]}>
              {formFields.notes}
            </h2>
          </div>{' '}
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
      <h2>{formFields.linkToDocumentation}</h2>
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
