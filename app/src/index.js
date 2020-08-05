import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import {
  QueryParamProvider,
  transformSearchStringJsonSafe,
} from 'use-query-params';
import { StylesProvider } from '@material-ui/styles';

import App from './App';
import configureStore from './configureStore';

const history = createBrowserHistory();
const store = configureStore(history);
const queryStringifyOptions = {
  transformSearchString: transformSearchStringJsonSafe,
};

ReactDOM.render(
  <StylesProvider injectFirst>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryParamProvider
          history={history}
          stringifyOptions={queryStringifyOptions}
        >
          <App />
        </QueryParamProvider>
      </ConnectedRouter>
    </Provider>
  </StylesProvider>,
  document.getElementById('root')
);
