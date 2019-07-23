import { connect } from "react-redux";
import { isLoggedIn, redirectToLogin, isAdmin } from "../../state/ducks/auth";
import { WithAdminPermissions } from "./AdminPermissions";

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
    isAdmin: isAdmin(state)
  }),
  dispatch => {
    return {
      redirectToLogin: () => dispatch(redirectToLogin())
    };
  }
)(WithAdminPermissions);
