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

const Invitation = ({ campaign, government, code /* email */ }) => (
  <FormModal>
    <p>
      You've been invited to join the following portal on Open Election by
      Civic:
    </p>
    <p css={formTitle}>
      {`${campaign}${government} ${campaign.length > 0 ? "Campaign" : ""}${
        government.length > 0 ? "Government" : ""
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
  </FormModal>
);

Invitation.defaultProps = {
  campaign: "",
  government: ""
};

export default Invitation;
