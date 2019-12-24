import React, { useState } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

import ExternalLink from '../external-link';
import Icon from '../icon';
import { getConfig, setConfig } from '../../utils/config';

const base = styled.div({
  position: 'fixed',
  bottom: 0,
  left: 0,
  background: props => lighten(0.05, props.theme.background)
});

const StyledFooter = styled(base)({
  padding: '15px 30px',
  right: 0,
  width: '100%'
});

const SmallButton = styled(base)({
  padding: '10px',
  margin: '8px',
  borderRadius: '100%',
  cursor: 'pointer',
  background: props => props.theme.linkBase,
  color: props => props.theme.textBase
});

const Right = styled.div({
  float: 'right'
});

const MarginLeft = {
  marginLeft: '1rem'
};

const Footer = () => {
  const [isSmall, setIsSmall] = useState(getConfig('footer_is_small') || false);

  const toggleSmall = () =>
    setIsSmall(prev => {
      const next = !prev;
      setConfig('footer_is_small', next);
      return next;
    });

  return (
    <>
      {isSmall && (
        <SmallButton onClick={toggleSmall} title="Open footer">
          <Icon icon="window-maximize" />
        </SmallButton>
      )}

      {!isSmall && (
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

          <Icon
            icon="window-minimize"
            onClick={toggleSmall}
            title="Close footer"
          />
          <Icon
            icon="plus"
            onClick={toggleSmall}
            title="Add video"
            style={MarginLeft}
          />
        </StyledFooter>
      )}
    </>
  );
};

export default Footer;
