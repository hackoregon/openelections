import React from "react";
import { connect } from "react-redux";
import Contributions from './Contributions';

class ContributionsPage extends React.Component {
  render() {
    return <Contributions {...this.props}/>
  }
}
export default connect(state => ({}))(ContributionsPage);