import { connect } from "react-redux";
import ManageUser from "./ManageUser";
import { showModal } from "../../../../state/ducks/modal";
import { inviteUser } from "../../../../state/ducks/users";


export default connect(
  state => ({}),
  dispatch => {
    return {
      showModal: payload => {
        console.log(payload);
        dispatch(showModal(payload));
      },
      inviteUser: (email, firstName, lastName, campaignOrGovernmentId, role) => dispatch(inviteUser(email, firstName, lastName, campaignOrGovernmentId, role)),
    };
  }
)(ManageUser);