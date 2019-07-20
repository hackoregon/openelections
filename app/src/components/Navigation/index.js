import { connect } from "react-redux";
import Navigation from "./Navigation";
import { isLoggedIn, logout } from "../../state/ducks/auth";

export default connect(state => ({
  isLoggedIn: isLoggedIn(state)
}), dispatch => {
  return {
    logOut: () => { dispatch(logout())}
  };
})(Navigation);
