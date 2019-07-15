import { connect } from "react-redux";
import ManageUser from "./ManageUser";
import { showModal } from "../../../../state/ducks/modal";

export default connect(
  state => ({}),
  dispatch => {
    return {
      showModal: payload => {
        console.log(payload);
        dispatch(showModal({ component: payload }));
      }
    };
  }
)(ManageUser);