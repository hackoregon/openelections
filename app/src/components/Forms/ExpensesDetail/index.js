import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import { updateExpenditure } from '../../../state/ducks/expenditures';
import {
  getCurrentUserId,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
} from '../../../state/ducks/auth';
import {
  BasicsSection,
  PayeeInfoSection,
  ViewHeaderSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import AddExpenseForm from '../AddExpense/AddExpenseForm';
import { ExpenditureStatusEnum } from '../../../api/api';
import { getCampaignName } from '../../../state/ducks/campaigns';
import { mapExpenditureFormToData } from '../../../Pages/Portal/Expenses/ExpendituresFields';

const onSubmit = (data, props) => {
  const initialData = props.data;
  const expenditureData = mapExpenditureFormToData(data);
  // TODO remove next line when GH-#725 is closed
  delete expenditureData.date;
  expenditureData.id = data.id;
  expenditureData.currentUserId = props.currentUserId;
  switch (data.buttonSubmitted) {
    case 'archive':
      expenditureData.status = ExpenditureStatusEnum.ARCHIVED;
      break;
    case 'move_to_draft':
      expenditureData.status = ExpenditureStatusEnum.DRAFT;
      break;
    case 'save':
      expenditureData.status = ExpenditureStatusEnum.DRAFT;
      break;
    case 'submit':
      expenditureData.status = ExpenditureStatusEnum.SUBMITTED;
      break;
    // Button that does not set buttonSubmitted would return to the
    // contributions list without updating the record
    default:
      expenditureData.status = false;
  }
  // TODO only send dirty fields
  // for (const key of Object.keys(data)) {
  //   if (initialData[key]) {
  //     if (data[key] !== initialData[key]) {
  //       updateAttributes[key] = data[key];
  //     }
  //   }
  // }
  if (expenditureData.status) {
    props
      .updateExpenditure(expenditureData)
      .then(() => props.history.push('/expenses'));
  } else {
    props.history.push('/expenses');
  }
};

const onSubmitSave = (data, props) => {
  const { updateExpenditure } = props;
  const expenditureData = mapExpenditureFormToData(data);
  const payload = {
    status: ExpenditureStatusEnum.DRAFT,
    ...expenditureData,
  };
  updateExpenditure(payload).then(data =>
    props.history.push(`/expenses/${data}`)
  );
};

class ExpensesDetailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    return (
      <AddExpenseForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={this.props.data}
      >
        {({
          formFields,
          isValid,
          handleSubmit,
          visibleIf,
          formErrors,
          values,
        }) => {
          // TODO Next line used to disable sections move to fields object and dynamic validate
          const isSubmited = !!(
            values.status === ExpenditureStatusEnum.SUBMITTED
          );
          if (values.buttonSubmitted && !isValid) {
            for (const [key, value] of Object.entries(formErrors)) {
              values.buttonSubmitted = '';
              this.props.flashMessage(value, { props: { variant: 'error' } });
            }
          }
          return (
            <>
              <ViewHeaderSection
                isCampAdmin={this.props.isCampAdmin}
                isCampStaff={this.props.isCampStaff}
                isValid={isValid}
                handleSubmit={handleSubmit}
                onSubmitSave={onSubmitSave}
                id={this.props.data.id}
                updatedAt={this.props.data.updatedAt}
                status={this.props.data.status}
                formValues={values}
                campaignName={this.props.campaignName}
              />
              <BasicsSection
                isSubmited={isSubmited}
                formFields={formFields}
                checkSelected={visibleIf.checkSelected}
                showInKindFields={visibleIf.showInKindFields}
                showPaymentMethod={visibleIf.paymentMethod}
              />
              <PayeeInfoSection
                isSubmited={isSubmited}
                formFields={formFields}
              />
            </>
          );
        }}
      </AddExpenseForm>
    );
  }
}

export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCampaignName(state),
  }),
  dispatch => ({
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateExpenditure: data => dispatch(updateExpenditure(data)),
  })
)(ExpensesDetailForm);
