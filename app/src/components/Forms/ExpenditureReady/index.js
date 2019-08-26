import React from 'react';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import ExpenditureReadyForm from './ExpenditureReadyForm';
import {
  ReadyHeaderSection,
  BasicsSection,
  PayeeInfoSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import {
  mapExpenditureDataToForm,
  mapExpenditureFormToData,
  ExpenditureStatusEnum,
} from '../../../api/api';
import { updateExpenditure } from '../../../state/ducks/expenditures';
import { expendituresEmptyState } from '../../../Pages/Portal/Expenses/ExpendituresFields';

class ExpenditureReady extends React.Component {
  updateExpenditure = payload => {
    const { updateExpenditure, showMessage } = this.props;
    delete payload.date; // TODO: should remove this later, current endpoint failing when including date in payload.
    const showErrorMessage = error =>
      showMessage(`Error: ${error.message}`, { props: { variant: 'error' } });
    const showSuccessMessage = () =>
      showMessage('Expenditure saved', { props: { variant: 'success' } });
    updateExpenditure(payload)
      .then(data =>
        data !== null ? showErrorMessage(data) : showSuccessMessage()
      )
      .catch(error => showErrorMessage(error));
  };

  onSubmit = (id, data) => {
    const { updateExpenditure } = this;
    const payload = {
      id,
      status: ExpenditureStatusEnum.SUBMITTED,
      ...mapExpenditureFormToData(data),
    };
    updateExpenditure(payload);
  };

  onDraft = (id, data) => {
    const { updateExpenditure } = this;
    const payload = {
      id,
      status: ExpenditureStatusEnum.DRAFT,
      ...mapExpenditureFormToData(data),
    };
    updateExpenditure(payload);
  };

  // TODO: currently sending user back to table, need proper behavior.
  onTrash = id => {
    // const { archiveExpenditure, history } = this.props;
    // archiveExpenditure(id).then(() => history.push('/expenditures'));
  };

  render() {
    const { expenditures, expenditureId } = this.props;
    const { onSubmit, onDraft, onTrash } = this;
    const expenditure = expenditures[expenditureId];
    const loadCheck = !expenditures.isLoading && expenditure;
    const { updatedAt, status } = loadCheck ? expenditure : {};
    return (
      <ExpenditureReadyForm
        onSubmit={data => onSubmit(expenditureId, data)}
        initialValues={
          loadCheck
            ? mapExpenditureDataToForm(expenditure)
            : expendituresEmptyState
        }
      >
        {({ formFields, isValid, handleSubmit, values }) => {
          const { paymentMethod } = values;
          const checkSelected = paymentMethod === 'Check';
          return (
            <>
              <ReadyHeaderSection
                status={status}
                campaignName="FakeName"
                lastEdited={updatedAt}
                isValid={isValid}
                handleSubmit={handleSubmit}
                handleDraft={() => onDraft(expenditureId, values)}
                handleTrash={() => onTrash(expenditureId)}
              />
              <BasicsSection
                formFields={formFields}
                checkSelected={checkSelected}
              />
              <PayeeInfoSection formFields={formFields} />
            </>
          );
        }}
      </ExpenditureReadyForm>
    );
  }
}
export default connect(
  (state, ownProps) => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId,
    history: ownProps.history,
    expenditures: state.expenditures,
  }),
  dispatch => ({
    // archiveExpenditure: id => dispatch(archiveExpenditure(id)),
    updateExpenditure: data => dispatch(updateExpenditure(data)),
    showMessage: (message, props) => dispatch(flashMessage(message, props)),
  })
)(ExpenditureReady);
