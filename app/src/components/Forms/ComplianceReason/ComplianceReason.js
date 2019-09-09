import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
} from '@material-ui/core';
import Button from '../../Button/Button';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
import RadioButtonGroup from '../../Fields/RadioButtons/RadioButtonGroup';
import ComplianceRadioButtons from './ComplianceRadioButtons';
/** @jsx jsx */

const complianceReasonStyle = css`
  word-break: break-word;
  max-width: 300px;
`;
const buttonContainer = css`
  display: flex;
  margin-top: 30px;
  button {
    margin: 10px;
  }
`;
const complianceReasonTitle = css`
  font-size: 24px;
`;

const modalStyle = css`
  position: absolute;
  width: 350px;
  background: white;
  top: 8vh;
  left: calc(50vw - 175px);
  display: flex;
  align-items: center;
`;

const ComplianceReason = props => {
  return (
    <div css={modalStyle}>
      <FormModal>
        <div css={complianceReasonStyle}>
          <h1 css={complianceReasonTitle}>Out of Compliance Reason </h1>
          <p>Choose Compliance Status</p>
          <>
            <ComplianceRadioButtons />
          </>
          <div css={buttonContainer}>
            <Button
              buttonType="formDefaultOutlined"
              onClick={() => props.clearModal()}
            >
              Cancel
            </Button>
            <Button
              buttonType="formDefault"
              onClick={
                () => {
                  console.log({ props });
                }
                // props.complianceReason(
                //   props.location.state.id,
                //   props.location.state.roleId
                // )
              }
            >
              Submit
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};
// export default ComplianceReason;
export default connect(
  state => ({
    getModalState: getModalState(state),
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
    };
  }
)(ComplianceReason);
