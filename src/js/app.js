import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { lighten, darken } from 'polished';

import Index from './pages';

const bgBase = '#000';
const textBase = '#fff';
const theme = {
  bgBase,
  textBase,
  background: lighten(0.1, bgBase),
  text: darken(0.25, textBase)
};

const GlobalStyle = createGlobalStyle({
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "游ゴシック体", YuGothic, "Yu Gothic Medium", sans-serif',
    background: props => props.theme.background,
    color: props => props.theme.text,
    fontSize: '1.15rem'
  },
  a: {
    color: '#036eec',
    textDecoration: 'none'
  },
  '*': {
    boxSizing: 'border-box'
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Normalize />
    <GlobalStyle />
    <Index />
  </ThemeProvider>
);

export default App;
