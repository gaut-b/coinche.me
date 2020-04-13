import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import HelpPage from './pages/HelpPage';
import LandingPage from './pages/LandingPage';
import ConfigPage from './pages/ConfigPage';
import GamePage from './pages/GamePage';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/help" component={HelpPage} />
      <Route exact path="/config" component={ConfigPage} />
      <Route exact path="/game/:tableId" component={GamePage} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('container')
);