/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";
import FormModal from "../FormModal/FormModal";
import Button from "../Button/Button";

const formTitle = css`
  font-size: 35px;
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
      You've been invited to join the following portal on Open Election by
      Civic:
    </p>
    <p css={formTitle}>
      {`${campaign}${government} ${campaign && campaign.length > 0 ? "Campaign" : ""}${
        government && government.length > 0 ? "Government" : ""
      } Portal`}
    </p>
    <p>
      To complete your invitation, click the Sign up button in this email and
      follow the instructions provided.
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
