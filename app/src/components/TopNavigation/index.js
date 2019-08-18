import { connect } from 'react-redux';
import TopNavigation from './TopNavigation';
import { isLoggedIn } from '../../state/ducks/auth';

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
  }),
  {}
)(TopNavigation);
