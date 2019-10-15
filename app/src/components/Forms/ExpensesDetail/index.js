import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { flashMessage } from 'redux-flash';
import PropTypes from 'prop-types';
import {
  updateExpenditure,
  getExpenditureById,
  getCurrentExpenditure,
} from '../../../state/ducks/expenditures';
import {
  getCurrentUserId,
  getCurrentCampaignName,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
  isGovAdminAuthenticated,
} from '../../../state/ducks/auth';
import {
  BasicsSection,
  PayeeInfoSection,
  ViewHeaderSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import ExpensesDetailForm from './ExpensesDetailForm';
import {
  ExpenditureStatusEnum,
  dateToMicroTime,
  dateToPickerFormat,
} from '../../../api/api';
import {
  mapExpenditureFormToData,
  mapExpenditureDataToForm,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';
import { PageTransitionImage } from '../../PageTransistion';
import ReadOnly from '../../ReadOnly';
import ActivityStreamForm from '../ActivityStream/index';
import { AssumeButton } from '../../Assume';

const onSubmit = (data, props) => {
  // Only PUT changed fields by comparing initialValues to submitted values
  const initialValues = props.currentExpenditure;
  const submittedValues = mapExpenditureFormToData(data);
  const alteredValues = {};

  // All dates must be converted to microtime to compare
  initialValues.date = dateToMicroTime(dateToPickerFormat(initialValues.date));
  initialValues.dateOriginalTransaction = dateToMicroTime(
    dateToPickerFormat(initialValues.dateOriginalTransaction)
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
    const { getExpenditureById, expenditureId } = this.props;
    if (expenditureId) getExpenditureById(parseInt(expenditureId));
  }

  render() {
    const {
      expenditureId,
      isGovAdminAuthenticated,
      currentExpenditure,
      flashMessage,
      isCampAdmin,
      isCampStaff,
      isGovAdmin,
      campaignName,
      history,
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
            // eslint-disable-next-line no-unused-vars
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
                AssumeButton={AssumeButton}
                isCampAdmin={isCampAdmin}
                isCampStaff={isCampStaff}
                isGovAdmin={isGovAdmin}
                history={history}
                isValid={isValid}
                handleSubmit={handleSubmit}
                id={initialFormData.id}
                updatedAt={initialFormData.updatedAt}
                status={initialFormData.status}
                formValues={values}
                isGovAdminAuthenticated={isGovAdminAuthenticated}
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
              <ActivityStreamForm expenditureId={expenditureId} />
            </>
          );
        }}
      </ExpensesDetailForm>
    );
  }
}

export default connect(
  state => ({
    currentExpenditure: getCurrentExpenditure(state),
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCurrentCampaignName(state),
    isGovAdminAuthenticated: isGovAdminAuthenticated(state),
  }),
  dispatch => ({
    push: url => dispatch(push(url)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateExpenditure: data => dispatch(updateExpenditure(data)),
    getExpenditureById: id => dispatch(getExpenditureById(id)),
  })
)(ExpensesDetail);

ExpensesDetail.propTypes = {
  getExpenditureById: PropTypes.func,
  expenditureId: PropTypes.number,
  isGovAdminAuthenticated: PropTypes.bool,
  currentExpenditure: PropTypes.number,
  flashMessage: PropTypes.func,
  isCampAdmin: PropTypes.bool,
  isCampStaff: PropTypes.bool,
  isGovAdmin: PropTypes.bool,
  campaignName: PropTypes.string,
  history: PropTypes.oneOfType([PropTypes.object]),
};
