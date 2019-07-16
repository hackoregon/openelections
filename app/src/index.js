import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
//import { createBrowserHistory } from "history";
import history from "./history";
import App from "./App";
import { default as configureStore } from "./configureStore";

//export const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
