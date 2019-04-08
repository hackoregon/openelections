import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './state/test';
import thunk from 'redux-thunk';


import './index.css';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (!composeEnhancers) {
  console.warn('Install Redux DevTools Extension to inspect the app state: ' +
    'https://github.com/zalmoxisus/redux-devtools-extension#installation');
}

const store = createStore(reducer, undefined, composeEnhancers(
  applyMiddleware(thunk)
));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
