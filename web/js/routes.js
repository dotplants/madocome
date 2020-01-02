import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Index from './pages/index';
import About from './pages/about';
import Shared from './pages/shared';
import Login from './pages/login';
import KeyLogin from './pages/key-login';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route exact path="/about" component={About} />
    <Route exact path="/shared" component={Shared} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/key-login" component={KeyLogin} />
  </Switch>
);

export default Routes;
