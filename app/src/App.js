import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Pages/routes";
import { Global, css } from "@emotion/core";
import FlashMessage from "./components/FlashMessage/FlashMessage";
import styles from "./assets/styles/global.styles";
import { connect } from "react-redux";
import { me } from "./state/ducks/auth";

class App extends React.Component {
  componentDidMount(): void {
    this.props.loadAuth()
  }

  render() {
    return (
      <BrowserRouter>
        <FlashMessage />
        <Global styles={styles} />
        <Routes />
      </BrowserRouter>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => {
    return {
      loadAuth: () => dispatch(me())
    }
  }
)(App);

