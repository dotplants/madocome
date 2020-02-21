/*
if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
}
*/

import React from 'react';
import { render } from 'react-dom';
import App from './app';
import ctl from './ctl';

window.ctl = ctl;

render(<App />, document.getElementById('app'));
