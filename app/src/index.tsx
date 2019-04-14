import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { default as configureStore } from './configureStore';
import './index.css';

const history = createHashHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
