import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";

import App from "./App";
import { default as configureStore } from "./configureStore";
import FlashMessage from './components/FlashMessage/FlashMessage';

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <App />
    <FlashMessage />
  </Provider>,
  document.getElementById("root")
);
