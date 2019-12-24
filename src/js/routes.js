import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Index from './pages/index';
import Shared from './pages/shared';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/shared" component={Shared} />
    </Switch>
  );
};

export default Routes;
