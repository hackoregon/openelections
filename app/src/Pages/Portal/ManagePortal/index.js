import { connect } from "react-redux";
import ManagePortal from "./ManagePortal";
import { getUsers } from "../../../state/ducks/users";

export default connect(state => ({
  userList: getUsers(state)
}))(ManagePortal);
