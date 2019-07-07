import React, { Component } from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import AddHeaderSectionForm from "../../../../components/Forms/AddContribution/Header/index";
import AddBasicsSectionForm from "../../../../components/Forms/AddContribution/BasicsSection/index";
import AddContributorSectionForm from "../../../../components/Forms/AddContribution/ContributorSection/index"
import { connect } from "react-redux";
import { login } from "../../../../state/ducks/auth";

class AddContribution extends Component {
  componentWillUpdate(newprops){
    if (!(typeof newprops.state.me == 'undefined' || !newprops.state.me)) {
      this.props.history.push('/dashboard')
    }
  }
  render() {
    return (
      <PageHoc>
        <AddHeaderSectionForm {...this.props} />
        <AddBasicsSectionForm {...this.props} />
        <AddContributorSectionForm {...this.props} />
      </PageHoc>
    );
  }
}

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
  )(AddContribution);
