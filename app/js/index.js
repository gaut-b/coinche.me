import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import LandingPage from './pages/LandingPage';
import Game from './components/Game';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/game/tableId=:tableId&username=:username" component={Game} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('container')
);