import React from 'react'
import { connect } from "react-redux";
import Button from '../../Button/Button'
import { getModalState } from "../../../state/ducks/modal";
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
    <div css={removeUserStyle}>
      {console.log({ props })}
      <p>{props.getModalState.state.email} will no longer have access to the portal.</p>
      <p>Are you sure you want to remove them?</p>
      <div css={buttonContainer}>
        <Button buttonType="formDefaultOutlined" onClick={() => console.log()}>
          Cancel
            </Button>
        <Button
          buttonType="formDefault" onClick={() => console.log()}>
          Submit
            </Button>
      </div>
    </div>
  )
}
// export default RemoveUser;
export default connect(
  state => ({
    getModalState: getModalState(state)
  })
)(RemoveUser);