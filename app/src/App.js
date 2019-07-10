import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Pages/routes";
import { Global, css } from '@emotion/core';
import FlashMessage from './components/FlashMessage/FlashMessage';
import styles from './assets/styles/global.styles';


class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
          <FlashMessage />
          <Global styles={styles}/>
          <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
