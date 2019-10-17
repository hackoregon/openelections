import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import PageHoc from '../../components/PageHoc/PageHoc';
import SignUpForm from '../../components/Forms/SignUp/index';
import { redeemInvite } from '../../state/ducks/auth';

class SignUp extends React.Component {
  render() {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const { invitationCode } = params;
    return (
      <PageHoc>
        <SignUpForm code={invitationCode} {...this.props} />
      </PageHoc>
    );
  }
}

export default connect(
  null,
  dispatch => {
    return {
      redeemInvite: (invitationCode, password) =>
        dispatch(redeemInvite(invitationCode, password)),
    };
  }
)(SignUp);

SignUp.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
