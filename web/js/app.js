import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { lighten, darken } from 'polished';

import Routes from './routes';
import autoRefreshToken from './utils/refresh-token';

const bgBase = '#000';
const textBase = '#fff';
const linkBase = '#036eec';
const theme = {
  bgBase,
  textBase,
  linkBase,
  background: lighten(0.1, bgBase),
  text: darken(0.25, textBase),
  shadow: '0 0 10px #00000050'
};

const GlobalStyle = createGlobalStyle({
  'html, body': {
    width: '100%',
    height: '100%'
  },
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "游ゴシック体", YuGothic, "Yu Gothic Medium", sans-serif',
    background: props => props.theme.background,
    color: props => props.theme.text,
    fontSize: '1.15rem'
  },
  a: {
    color: props => props.theme.linkBase,
    textDecoration: 'none'
  },
  '.size-max': {
    width: '100%',
    height: '100%'
  },
  '*, *:after, *:before': {
    boxSizing: 'border-box'
  }
});

autoRefreshToken();
const App = () => (
  <ThemeProvider theme={theme}>
    <Normalize />
    <GlobalStyle />
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
