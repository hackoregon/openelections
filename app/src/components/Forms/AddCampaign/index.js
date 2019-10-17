import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import AddCampaignForm from './AddCampaignForm';
import { createCampaignForGovernment } from '../../../state/ducks/campaigns';
import { clearModal } from '../../../state/ducks/modal';
/** @jsx jsx */
import { getCurrentGovernmentId } from '../../../state/ducks/governments';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
  display: flex;
  width: 85%;
  justify-content: space-around;
`;

const AddCampaign = props => (
  <FormModal>
    <AddCampaignForm
      onSubmit={({ name, email, firstName, lastName, officeSought }) => {
        props.createCampaignForGovernment(
          props.governmentId,
          name,
          officeSought,
          email,
          firstName,
          lastName
        );
        props.clearModal();
      }}
      initialValues={{
        name: '',
        officeSought: '',
        email: '',
        firstName: '',
        lastName: '',
      }}
    >
      {({ formSections, isValid, handleCancel, handleSubmit }) => {
        return (
          <React.Fragment>
            <p css={formTitle}>Add New Campaign</p>
            <p>
              Enter the user's information and we will send them an email with
              instructions to join your portal.
            </p>
            {formSections.AddCampaign}
            <div css={buttonWrapper}>
              <Button
                buttonType="cancel"
                onClick={() => {
                  handleCancel();
                  props.clearModal();
                }}
              >
                Cancel
              </Button>
              <Button
                buttonType="submit"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </React.Fragment>
        );
      }}
    </AddCampaignForm>
  </FormModal>
);

export default connect(
  state => ({
    governmentId: getCurrentGovernmentId(state),
  }),
  dispatch => {
    return {
      createCampaignForGovernment: (
        governmentId,
        name,
        officeSought,
        email,
        firstName,
        lastName
      ) =>
        dispatch(
          createCampaignForGovernment(
            governmentId,
            name,
            officeSought,
            email,
            firstName,
            lastName
          )
        ),
      clearModal: () => dispatch(clearModal()),
    };
  }
)(AddCampaign);

AddCampaign.propTypes = {
  createCampaignForGovernment: PropTypes.func,
  clearModal: PropTypes.func,
  governmentId: PropTypes.number,
};
