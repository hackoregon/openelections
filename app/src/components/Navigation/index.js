import { connect } from 'react-redux';
import Navigation from './Navigation';
import { isLoggedIn, logout } from '../../state/ducks/auth';
import { showModal } from '../../state/ducks/modal';

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
  }),
  dispatch => {
    return {
      logOut: () => {
        dispatch(logout());
      },
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(Navigation);
