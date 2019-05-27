import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Pages/routes";

import "./assets/styles/styles.scss";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
