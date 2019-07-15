import React from 'react'
import Button from '../../Button/Button'
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const buttonContainer = css`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

const RemoveUser = (props) => {

  return (
    <div>
      <p>email will no longer have access to the portal.</p>
      <p>Are you sure you want to remove them?</p>
      <div css={buttonContainer}>
        <Button buttonType="cancel" onClick={() => console.log()}>
          Cancel
            </Button>
        <Button
          buttonType="submit" onClick={() => console.log()}>
          Submit
            </Button>
      </div>
    </div>
  )
}
export default RemoveUser