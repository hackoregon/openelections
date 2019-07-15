import { connect } from "react-redux";
import ManagePortal from "./ManagePortal";
import { getUsers } from "../../../state/ducks/users";
import { showModal } from "../../../state/ducks/modal";

export default connect(
  state => ({
    userList: getUsers(state)
  }),
  dispatch => {
    return {
      showModal: payload => {
        console.log(payload);
        dispatch(showModal(payload));
      }
    };
  }
)(ManagePortal);
