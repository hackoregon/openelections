import React from "react";
import FormModal from "../FormModal/FormModal";
import Button from "../Button/Button";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;

const Invitation = ({ campaign }) => (
  <FormModal>
    <p>
      You've been invited to join the following portal on Open Election by Civic:
    </p>
    <p css={formTitle}>{`${campaign} Campaign Portal`}</p>
    <p>
      To complete your invitation, click the Sign up button in this email and
      follow the instructions provided.
    </p>
    <div css={buttonWrapper}>
      <Button buttonType="signup" onClick={() => console.log("hi")}>
        Sign up
      </Button>
    </div>
  </FormModal>
);

Invitation.defaultProps = {
  campaign: "DeSilva"
}

export default Invitation;
