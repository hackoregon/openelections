import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { createExpenditure } from '../../../state/ducks/expenditures';
import {
  getCurrentCampaignId,
  getCurrentUserId,
} from '../../../state/ducks/auth';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';
import AddExpenseForm from './AddExpenseForm';
import { ExpenditureStatusEnum } from '../../../api/api';
import {
  AddHeaderSection,
  BasicsSection,
  PayeeInfoSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import {
  expendituresEmptyState,
  mapExpenditureFormToData,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';

const onSubmit = (data, props) => {
  const { currentUserId, governmentId, campaignId, createExpenditure } = props;
  const expenditureData = mapExpenditureFormToData(data);
  const payload = {
    status: ExpenditureStatusEnum.DRAFT,
    governmentId,
    campaignId,
    currentUserId,
    ...expenditureData,
  };
  createExpenditure(payload).then(data =>
    props.history.push(`/expenses/${data}`)
  );
};

const AddExpense = ({ ...props }) => (
  <AddExpenseForm
    onSubmit={data => onSubmit(data, props)}
    initialValues={expendituresEmptyState}
  >
    {({ formFields, isValid, handleSubmit, visibleIf, formErrors }) => {
      console.log('Required fields', Object.keys(formErrors));
      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection
            formFields={formFields}
            checkSelected={visibleIf.checkSelected}
            showPaymentMethod={visibleIf.paymentMethod}
            showPurposeType={visibleIf.showPurposeType}
          />
          <PayeeInfoSection
            formFields={formFields}
            showEmployerSection={visibleIf.showEmployerSection}
            isPerson={visibleIf.isPerson}
          />
        </>
      );
    }}
  </AddExpenseForm>
);

export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    governmentId: getCurrentGovernmentId(state),
    campaignId: getCurrentCampaignId(state),
  }),
  dispatch => ({
    createExpenditure: data => dispatch(createExpenditure(data)),
  })
)(AddExpense);
