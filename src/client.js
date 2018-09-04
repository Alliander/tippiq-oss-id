import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import jwtDecode from 'jwt-decode';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { configureStore } from './store';
import getRoutes from './routes';
import { Api, getUserToken, persistUserToken } from './helpers';

const api = new Api();
const initialState = window.__data;  // eslint-disable-line no-underscore-dangle

const token = getUserToken();
if (token) {
  const userId = jwtDecode(token).sub;
  initialState.login = { token, id: userId };
}

const store = configureStore(initialState, undefined, false, api);
const history = syncHistoryWithStore(browserHistory, store);
persistUserToken(store);

render(
  <Provider
    store={store}
    key="provider"
  >
    <Router
      render={(props) =>
        <ReduxAsyncConnect
          helpers={{ api }}
          {...props}
        />}
      history={history}
    >
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('content')
);

if (module.hot) {
  module.hot.accept();
}
