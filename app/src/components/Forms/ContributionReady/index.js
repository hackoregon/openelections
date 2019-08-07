import React from "react";
import ContributionReadyForm from "./ContributionReadyForm";
import { connect } from "react-redux";
import { ReadyHeaderSection, BasicsSection, ContributorSection, OtherDetailsSection } from "../../../Pages/Portal/Contributions/Utils/ContributionsSections";
import {
    mapContributionDataToForm,
    mapContributionFormToData,
    ContributionStatusEnum
} from '../../../api/api';
import { updateContribution, archiveContribution } from "../../../state/ducks/contributions";
import { flashMessage } from "redux-flash";

class ContributionReady extends React.Component {
  updateContribution = (payload) => {
    const { updateContribution, showMessage } = this.props
    delete payload.date // TODO: should remove this later, current endpoint failing when including date in payload.
    const showErrorMessage = (error) => showMessage(`Error: ${error.message}`, { props: { variant: "error" } })
    const showSuccessMessage = () => showMessage("Contribution saved", { props: { variant: "success" } })
    updateContribution(payload)
      .then(data => data != null ? showErrorMessage(data) : showSuccessMessage())
      .catch(error => showErrorMessage(error))
  }
  
  onSubmit = (id, data) => {
    const { updateContribution } = this
    const payload = { 
      id, 
      status:  ContributionStatusEnum.SUBMITTED,
      ...mapContributionFormToData(data) 
    }
    updateContribution(payload)
  }

  onDraft = (id, data) => {
    const { updateContribution } = this
    const payload = { id, ...mapContributionFormToData(data) }
    updateContribution(payload)
  }

  // TODO: currently sending user back to table, need proper behavior.
  onTrash = (id) => {
    const { archiveContribution, history } = this.props
    archiveContribution(id).then(() => history.push('/contributions'))
  }


  render() {
    const { contribution, contributionId } = this.props
    const { onSubmit, onDraft, onTrash } = this
    return (
      <ContributionReadyForm
        onSubmit={data => onSubmit(contributionId, data)}
        initialValues={mapContributionDataToForm(contribution)}
      >
        {({ formFields, isValid, handleSubmit, values }) => (
          <>
            <ReadyHeaderSection
              isValid={isValid}
              handleSubmit={handleSubmit}
              handleDraft={() => onDraft(contributionId, values)}
              handleTrash={() => onTrash(contributionId)}
            />
            <BasicsSection formFields={formFields} />
            <ContributorSection formFields={formFields} />
            <OtherDetailsSection formFields={formFields} />
          </>
        )}
      </ContributionReadyForm>
    )
  }
}
export default connect(
  (state, ownProps) => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId,
    history: ownProps.history
  }),
  dispatch => ({
    archiveContribution: (id) => dispatch(archiveContribution(id)),
    updateContribution: (data) => dispatch(updateContribution(data)),
    showMessage: (message, props) => dispatch(flashMessage(message, props))
  })
)(ContributionReady);
