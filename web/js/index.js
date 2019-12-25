if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
}

import React from 'react';
import { render } from 'react-dom';
import App from './app';

render(<App />, document.getElementById('app'));
