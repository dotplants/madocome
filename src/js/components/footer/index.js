import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import ExternalLink from '../external-link';

const StyledFooter = styled.div({
  padding: '15px 30px',
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  background: props => lighten(0.05, props.theme.background)
});

const Right = styled.div({
  float: 'right'
});

const Footer = () => {
  return (
    <StyledFooter>
      <Right>
        <b>
          <small>
            <ExternalLink href="https://github.com/nzws/live-viewer">
              live-viewer
            </ExternalLink>{' '}
            built by{' '}
            <ExternalLink href="https://nzws.me">@nzws_me</ExternalLink>
          </small>
        </b>
      </Right>
      hello
    </StyledFooter>
  );
};

export default Footer;
