import React from 'react';
import { connect } from 'react-redux';
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
import { ExpenditureStatusEnum } from '../../../api/api';
import {
  mapExpenditureFormToData,
  mapExpenditureDataToForm,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';
import { PageTransitionImage } from '../../PageTransistion';
import ReadOnly from '../../ReadOnly';

const onSubmit = (data, props) => {
  const expenditureData = mapExpenditureFormToData(data);
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
    default:
      expenditureData.status = false;
  }
  if (expenditureData.status) {
    props.updateExpenditure(expenditureData);
  } else {
    props.history.push('/expenses');
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
    let data = {};
    if (currentExpenditure) {
      data = mapExpenditureDataToForm(currentExpenditure);
    }
    return (
      <ExpensesDetailForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={data}
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
            data.status === ExpenditureStatusEnum.SUBMITTED ||
            data.status === ExpenditureStatusEnum.ARCHIVED ||
            ExpenditureStatusEnum.OUT_OF_COMPLIANCE ||
            ExpenditureStatusEnum.IN_COMPLIANCE
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
                id={data.id}
                updatedAt={data.updatedAt}
                status={data.status}
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
    getExpenditureById: id => dispatch(getExpenditureById(id)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateExpenditure: data => dispatch(updateExpenditure(data)),
  })
)(ExpensesDetail);
