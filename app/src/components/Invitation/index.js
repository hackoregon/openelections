/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FormModal from '../FormModal/FormModal';
import Button from '../Button/Button';

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
const Invitation = ({ campaign, government, code }) => (
  <FormModal>
    <div css={center}>
      <p>You&apos;ve been invited to join:</p>
      <p css={formTitle}>
        {`${campaign && campaign.length > 0 ? campaign : ''}${
          government && government.length > 0 ? government : ''
        } ${
          !campaign && !government
            ? 'Small Donor Elections Portland'
            : ' Portal'
        }`}
      </p>
      <p>
        in the Small Donor Elections Portland program. Click below to complete
        your registration.
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
  campaign: '',
  government: '',
};

export default Invitation;

Invitation.propTypes = {
  campaign: PropTypes.string,
  government: PropTypes.string,
  code: PropTypes.string,
};
