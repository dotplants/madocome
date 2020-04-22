import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { lighten, darken } from 'polished';

import Routes from './routes';
import autoRefreshToken from './utils/refresh-token';
import Container from './container';
import I18nProvider from './utils/locale/provider';
import ErrorBoundary from './error';

const bgBase = '#000';
const textBase = '#fff';
const linkBase = '#3689ff';
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
    boxSizing: 'border-box',
    transition: '120ms ease',
    // for firefox
    scrollbarWidth: 'thin'
  },
  '::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
    background: ({ theme: { background } }) => background,
    '&-thumb': {
      background: ({ theme: { background } }) => lighten(0.2, background),
      border: 'none'
    }
  }
});

autoRefreshToken(true);
const App = () => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Normalize />
      <GlobalStyle />
      <Container.Provider>
        <I18nProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </I18nProvider>
      </Container.Provider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
