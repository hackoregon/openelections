import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { StylesProvider } from '@material-ui/styles';

import App from './App';
import configureStore from './configureStore';

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <StylesProvider injectFirst>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </StylesProvider>,
  document.getElementById('root')
);
