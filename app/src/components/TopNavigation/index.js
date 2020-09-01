import { connect } from 'react-redux';
import TopNavigation from './TopNavigation';
import { isLoggedIn } from '../../state/ducks/auth';
import { resetAll } from '../../state/ducks/publicData';

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
  }),
  dispatch => {
    return {
      resetAll: () => dispatch(resetAll()),
    };
  }
)(TopNavigation);
