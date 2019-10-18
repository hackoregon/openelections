import { connect } from 'react-redux';
import ManageUser from './ManageUser';
import { showModal } from '../../../../state/ducks/modal';

export default connect(
  null,
  dispatch => {
    return {
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(ManageUser);
