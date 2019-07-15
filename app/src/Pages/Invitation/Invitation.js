import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import Invitation from "../../components/Invitation";
import { connect } from "react-redux";
import { login, isLoggedIn } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";

class InvitationPage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(){
    const { isLoggedIn, authError, flashMessage, history } = this.props;
    if(isLoggedIn){
      flashMessage('Invitation Success', {props:{variant:'success'}});
      history.push('/dashboard');
    }else if(authError){
     flashMessage("Invitation Error", {props:{variant:'error'}});
    }
  }
  
  render() {
    return (
      <PageHoc>
        <Invitation {...this.props} />
      </PageHoc>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state) || false,
    authError: state.auth.error
  }), 
  dispatch => {
    return {
      login: (email,password) => dispatch(login(email,password)),
      flashMessage: (message, options) => dispatch(flashMessage(message, options)),
      dispatch
    }
  }
)(InvitationPage);
