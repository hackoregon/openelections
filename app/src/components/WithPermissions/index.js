import { connect } from 'react-redux';
import { isLoggedIn, redirectToLogin } from '../../state/ducks/auth';
import { WithPermissions } from './Permissions';

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
  }),
  dispatch => {
    return {
      redirectToLogin: () => dispatch(redirectToLogin()),
    };
  }
)(WithPermissions);
