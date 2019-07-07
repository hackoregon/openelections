import { connect } from "react-redux";
import Contributions from "./Contributions";
// import { isLoggedIn } from "../../state/ducks/auth";

export default connect(
state => { 
    return {state: state.auth}
  }, 
  dispatch => {
    return {
      login: (email,password) => dispatch(login(email,password)),
      dispatch
      }
    }
)(Contributions);