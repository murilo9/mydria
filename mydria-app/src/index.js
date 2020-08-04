import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './mydria.css';
import { Redirect } from 'react-router-dom';

import mydriaApp from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import pages from './pages';

const store = createStore(mydriaApp);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>

      {/* Todas as páginas existentes são inseridas aqui */}

      <Route exact path="/login" component={pages.Login}/>
      <Route exact path="/feed" component={pages.Feed}/>

      {/* A princípio, páginas não-reconhecidas redirecionam pra /login */}
      <Redirect from="*" to="/login" />

    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
