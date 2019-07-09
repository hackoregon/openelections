import { connect } from "react-redux";
import Modal from "./Modal";
import { getModalState, clearModal } from "../../state/ducks/modal";

export default connect(
  state => ({
    getModalState: getModalState(state)
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal())
    };
  }
)(Modal);
