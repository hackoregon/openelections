import * as React from "react";
import { Router } from "react-router-dom";
import Routes from "./Pages/routes";
import { Global, css } from "@emotion/core";
import FlashMessage from "./components/FlashMessage/FlashMessage";
import styles from "./assets/styles/global.styles";
import history from './history'

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <FlashMessage />
        <Global styles={styles} />
        <Routes />
      </Router>
    );
  }
}

export default App;
