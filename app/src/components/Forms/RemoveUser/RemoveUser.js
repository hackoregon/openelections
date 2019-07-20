import React from 'react'
import { connect } from "react-redux";
import Button from '../../Button/Button'
import { getModalState, clearModal } from "../../../state/ducks/modal";
import FormModal from "../../FormModal/FormModal";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const removeUserStyle = css`
  padding: 40px;
`;
const buttonContainer = css`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  align-items: center;
  justify-content: space-around;
  button {
    margin: 10px;
  }
`;

const RemoveUser = (props) => {

  return (
    <FormModal>
    <div css={removeUserStyle}>
      <p>{props.location.state.email} will no longer have access to the portal.</p>
      <p>Are you sure you want to remove them?</p>
      <div css={buttonContainer}>
        <Button buttonType="formDefaultOutlined" onClick={() => props.clearModal()}>
          Cancel
            </Button>
        <Button
          buttonType="formDefault" onClick={
            () => props.removeUser(props.location.state.id, props.location.state.roleId)
            }>
          Submit
            </Button>
      </div>
    </div>
    </FormModal>
  )
}
// export default RemoveUser;
export default connect(
  state => ({
    getModalState: getModalState(state)
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal())
    };
  }
  
)(RemoveUser);