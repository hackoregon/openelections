import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Pages/routes";
import { Global, css } from '@emotion/core';

import styles from './assets/styles/global.styles';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
          <Global styles={styles}/>
          <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
