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
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import AddExpenseForm from '../AddExpense/AddExpenseForm';
import {
  ExpenditureStatusEnum,
  mapExpenditureFormToData,
} from '../../../api/api';

const onSubmit = (data, props) => {
  const initialData = props.data;
  const expenditureData = mapExpenditureFormToData(data);
  delete expenditureData.date;
  delete expenditureData.calendarYearAggregate;
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

const containers = {
  header: css`
    width: 96%;
    min-height: 100%;
    display: grid;
    grid-template-rows: repeat(auto-fit(15px, 1fr));
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 20px;
    margin-right: 38px;
    margin-bottom: 15px;
  `,
  main: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  sectionTwo: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  fullWidth: css`
    display: grid;
    grid-template-rows: repeat(auto-fit(50px, 1fr));
    grid-template-columns: 1fr;
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
  cityStateZip: css`
    width: 96%%;
    min-height: 25px;
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(15px, 1fr));
    grid-template-columns: 2fr 22% 24%;
    grid-gap: 20px;
    margin-bottom: 20px;
  `,
};

const headerStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
    margin-right: 38px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  leftColumn: css`
    margin-right: 70px;
  `,
  rightColumn: css`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  `,
  invoice: css`
    font-size: 48px;
    line-height: 57px;
    margin: 0px;
    /* identical to box height */
    color: #333333;
  `,
  subheading: css`
    font-size: 16px;
    line-height: 19px;
    margin-top: 0px;
    width: 360px;
  `,
  // labelBlock: css`
  //   margin-right: 40px;
  // `,
  // labels: css`
  //   font-size: 13px;
  //   line-height: 15px;
  //   color: #979797;
  //   margin-bottom: 4px;
  // `,
  smallBlueText: css`
    font-size: 13px;
    line-height: 15px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  largerBlueText: css`
    font-size: 16px;
    line-height: 19px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  status: css`
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  actualStatus: css`
    font-size: 21px;
    line-height: 25px;
    color: #000000;
    margin-top: 0px;
    margin-bottom: 0px;
  `,
  statusBlock: css`
    flex-direction: column;
    align-items: left;
  `,
  buttonDiv: css`
    justify-content: space-between;
    align-self: flex-end;
  `,
  submitButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
  `,
  draftButton: css`
    // HAVING ZERO IMPACT
    background-color: #5f5fff;
    border-radius: 5px;
    width: 165px;
    height: 50px;
  `,
};

const sectionStyles = {
  main: css`
    margin-right: 34px;
    margin-bottom: 34px;
    margin-top: 34px;
  `,
  dividerLine: css`
    margin-left: -20px;
  `,
  title: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    width: 100%;
    color: #000000;
    margin-top: 55px;
  `,
  notes: css`
    margin-top: 75px;
  `,
};

// HEADER VALUES
const invoiceNumber = '#1030090212';
const campaignName = 'FakeName';
const lastEdited = '09/09/2019'; // NEEDS TO BE ACTUAL DATE
const currentStatus = 'Submitted';
// const labelsCount = 0;

const invoiceNumberBlock = (
  <React.Fragment>
    <p css={headerStyles.invoice}>{invoiceNumber}</p>
    <p css={headerStyles.subheading}>
      {`${campaignName} Campaign`} | {`Last Edited ${lastEdited}`}
    </p>
  </React.Fragment>
);

const statusBlock = (
  <div css={headerStyles.statusBlock}>
    <p css={headerStyles.status}>Current Status</p>
    <p css={headerStyles.actualStatus}>{currentStatus}</p>
    <p css={headerStyles.largerBlueText}>Jump to Activity ↓</p>
  </div>
);

// const labelBlock = (
//   <div css={headerStyles.labelBlock}>
//     <p css={headerStyles.labels}>{`Labels (${labelsCount})`}</p>
//     <p style={{ fontSize: "7px", color: "green" }}>()()()</p>
//     {/* placeholder for icon ^ */}
//     <p css={headerStyles.smallBlueText}>Manage</p>
//   </div>
// );

// const ExpensesDetail = () => (
//   <>

//       {({ formFields, isValid, handleSubmit /* isDirty, isSubmitting */ }) => (
//         <React.Fragment>
//           <hr css={sectionStyles.dividerLine} />

//           {/* BASICS SECTION */}
//           <div css={sectionStyles.main}>
//             <h3 css={sectionStyles.title}>Basics</h3>
//             <div css={containers.main}>
//               <h2>{formFields.amount}</h2>
//               <h2>{formFields.date}</h2>
//               <h2>{formFields.expenditureType}</h2>
//               <h2>{formFields.expenditureSubType}</h2>
//               <h2>{formFields.paymentMethod}</h2>
//               <h2>{formFields.checkNumber}</h2>
//               <h2>{formFields.purposeType}</h2>
//             </div>
//           </div>

//           {/* PAYEE INFO SECTION */}
//           <div css={sectionStyles.main}>
//             <h3 css={sectionStyles.title}>Payee Information</h3>
//             <div css={containers.sectionTwo}>
//               <h2>{formFields.payeeType}</h2>
//               <h2>{formFields.payeeName}</h2>
//             </div>
//             <h2 css={containers.fullWidth}>{formFields.streetAddress}</h2>
//             <h2 css={containers.fullWidth}>{formFields.addressLine2}</h2>
//             <div css={containers.cityStateZip}>
//               <h2>{formFields.city}</h2>
//               <h2>{formFields.state}</h2>
//             </div>
//             <div css={containers.sectionTwo}>
//               <h2>{formFields.zipcode}</h2>
//             </div>
//           </div>
//           <div css={sectionStyles.main}>
//             <h2 css={[containers.fullWidth, sectionStyles.notes]}>
//               {formFields.notes}
//             </h2>
//           </div>
//         </React.Fragment>
//       )}
//     </ExpensesDetailForm>
//   </>
// );
export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
  }),
  dispatch => ({
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateContribution: data => dispatch(updateExpenditure(data)),
  })
)(ExpensesDetailForm);
