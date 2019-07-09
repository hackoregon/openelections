import { connect } from "react-redux";
import Modal from "./Modal";
import { modalIsActive, clearModal } from "../../state/ducks/modal";

export default connect(
  state => ({
    modalIsActive: modalIsActive(state)
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal())
    };
  }
)(Modal);
