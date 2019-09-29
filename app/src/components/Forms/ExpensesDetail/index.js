import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { flashMessage } from 'redux-flash';
import {
  updateExpenditure,
  getExpenditureById,
  getCurrentExpenditure,
  getCurrentExpenditureId,
} from '../../../state/ducks/expenditures';
import {
  getCurrentUserId,
  getCurrentCampaignName,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
} from '../../../state/ducks/auth';
import {
  BasicsSection,
  PayeeInfoSection,
  ViewHeaderSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import ExpensesDetailForm from './ExpensesDetailForm';
import { ExpenditureStatusEnum, dateToMicroTime } from '../../../api/api';
import {
  mapExpenditureFormToData,
  mapExpenditureDataToForm,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';
import { PageTransitionImage } from '../../PageTransistion';
import ReadOnly from '../../ReadOnly';

const onSubmit = (data, props) => {
  // Only PUT changed fields by comparing initialValues to submitted values
  const initialValues = props.currentExpenditure;
  const submittedValues = mapExpenditureFormToData(data);
  const alteredValues = {};

  // All dates must be converted to microtime to compare
  initialValues.date = dateToMicroTime(initialValues.date);
  initialValues.dateOriginalTransaction = dateToMicroTime(
    initialValues.dateOriginalTransaction
  );
  for (const [field, value] of Object.entries(submittedValues)) {
    if (value !== initialValues[field]) {
      if (!(!alteredValues[field] && !value)) alteredValues[field] = value;
    }
  }

  switch (data.buttonSubmitted) {
    case 'archive':
      alteredValues.status = ExpenditureStatusEnum.ARCHIVED;
      break;
    case 'move_to_draft':
      alteredValues.status = ExpenditureStatusEnum.DRAFT;
      break;
    case 'save':
      // alteredValues.status = ExpenditureStatusEnum.DRAFT;
      break;
    case 'submit':
      alteredValues.status = ExpenditureStatusEnum.SUBMITTED;
      break;
    default:
  }
  if (Object.keys(alteredValues).length) {
    alteredValues.id = data.id;
    alteredValues.currentUserId = props.currentUserId;
    props.updateExpenditure(alteredValues);
  } else {
    props.push('/expenses');
  }
};

class ExpensesDetail extends React.Component {
  constructor(props) {
    super(props);
    const { getExpenditureById, expenditureId } = props;
    getExpenditureById(parseInt(expenditureId));
  }

  render() {
    const {
      expenditureId,
      currentExpenditure,
      flashMessage,
      isCampAdmin,
      isCampStaff,
      isGovAdmin,
      campaignName,
    } = this.props;
    let initialFormData = {};
    if (currentExpenditure) {
      initialFormData = mapExpenditureDataToForm(currentExpenditure);
    }
    return (
      <ExpensesDetailForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={initialFormData}
        key={expenditureId}
      >
        {({
          formFields,
          isValid,
          handleSubmit,
          visibleIf,
          formErrors,
          values,
        }) => {
          const isSubmited = !!(
            values.status === ExpenditureStatusEnum.SUBMITTED
          );
          if (values.buttonSubmitted && !isValid) {
            for (const [key, value] of Object.entries(formErrors)) {
              values.buttonSubmitted = '';
              flashMessage(value, { props: { variant: 'error' } });
            }
          }
          const isReadOnly = !!(
            isGovAdmin ||
            initialFormData.status === ExpenditureStatusEnum.SUBMITTED ||
            initialFormData.status === ExpenditureStatusEnum.ARCHIVED ||
            initialFormData.status ===
              ExpenditureStatusEnum.OUT_OF_COMPLIANCE ||
            initialFormData.status === ExpenditureStatusEnum.IN_COMPLIANCE
          );

          return parseInt(values.id) !== parseInt(expenditureId) ? (
            <PageTransitionImage />
          ) : (
            <>
              <ViewHeaderSection
                isCampAdmin={isCampAdmin}
                isCampStaff={isCampStaff}
                isGovAdmin={isGovAdmin}
                isValid={isValid}
                handleSubmit={handleSubmit}
                id={initialFormData.id}
                updatedAt={initialFormData.updatedAt}
                status={initialFormData.status}
                formValues={values}
                campaignName={values.campaignName || campaignName} // Remove ` || campaignName` when api returns campaignName on single row request.
              />
              <ReadOnly ro={isReadOnly}>
                <BasicsSection
                  isSubmited={isSubmited}
                  formFields={formFields}
                  checkSelected={visibleIf.checkSelected}
                  showInKindFields={visibleIf.showInKindFields}
                  showPaymentMethod={visibleIf.paymentMethod}
                  showPurposeType={visibleIf.showPurposeType}
                  showOriginalDateAndVendor={
                    visibleIf.showOriginalDateAndVendor
                  }
                  showCompliant={currentExpenditure.status}
                />
                <PayeeInfoSection
                  isSubmited={isSubmited}
                  formFields={formFields}
                />
              </ReadOnly>
            </>
          );
        }}
      </ExpensesDetailForm>
    );
  }
}

export default connect(
  state => ({
    currentExpenditureId: getCurrentExpenditureId(state),
    currentExpenditure: getCurrentExpenditure(state),
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCurrentCampaignName(state),
  }),
  dispatch => ({
    push: url => dispatch(push(url)),
    getExpenditureById: id => dispatch(getExpenditureById(id)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateExpenditure: data => dispatch(updateExpenditure(data)),
  })
)(ExpensesDetail);
