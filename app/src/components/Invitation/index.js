/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";
import FormModal from "../FormModal/FormModal";
import Button from "../Button/Button";

const formTitle = css`
  font-size: 24px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;
const center = css`
  left: calc(50vw - 175px);
  position: absolute;
  max-width: 350px;
`;
const Invitation = ({ campaign, government, code /* email */ }) => (
  <FormModal>
    <div css={center}>
    <p>
      You've been invited to join:
    </p>
    <p css={formTitle}>
      {`${campaign && campaign.length > 0 ? campaign : ""}${
        government && government.length > 0 ? government : ""
      } Portal`}
    </p>
    <p>
      in the Open and Accountable Elections Portland program. Click below to complete your registration.
    </p>
    <div css={buttonWrapper}>
      <Link to={`/sign-up?invitationCode=${code}`}>
        <Button buttonType="signup">Sign up</Button>
      </Link>
    </div>
    </div>
  </FormModal>
);

Invitation.defaultProps = {
  campaign: "",
  government: ""
};

export default Invitation;
