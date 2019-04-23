import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from '../src/configureStore';
import { createHashHistory } from 'history';


​const history = createHashHistory();
const store = configureStore( history );

export default function Provider({ story }) {
  return (
    <ReduxProvider store={store}>
      {story}
    </ReduxProvider>
  );
};