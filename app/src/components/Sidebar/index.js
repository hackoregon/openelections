import { connect } from "react-redux";
import Sidebar from "./Sidebar";

export default connect(state => ({
	campaignName: 'Campaign Name'
}))(Sidebar);
