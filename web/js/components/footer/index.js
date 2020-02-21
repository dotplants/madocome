import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';

import Container from '../../container';
import ExternalLink from '../external-link';
import Icon from '../icon';
import { getStringData } from '../../utils/config';

const base = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  background: lighten(0.05, theme.background),
  boxShadow: theme.shadow
}));

const StyledFooter = styled(base)({
  padding: '15px 30px',
  right: 0,
  width: '100%',
  zIndex: 9
});

const SmallButton = styled(base)(({ theme }) => ({
  padding: '10px',
  margin: '8px',
  borderRadius: '100%',
  cursor: 'pointer',
  background: theme.linkBase,
  color: theme.textBase
}));

const Right = styled.div({
  float: 'right'
});

const MarginLeft = {
  marginLeft: '1.5rem'
};

const Footer = ({ addVideo }) => {
  const { formatMessage } = useIntl();
  const { conf, setConf } = Container.useContainer();

  const toggleSmall = () => setConf('footer_is_small', !conf.footer_is_small);
  const generateLink = () => {
    const data = encodeURIComponent(getStringData());
    return prompt(
      formatMessage({ id: 'components.footer.generate_link.desc' }),
      `${location.origin}/shared?${data}`
    );
  };

  return (
    <>
      {conf.footer_is_small && (
        <SmallButton
          onClick={toggleSmall}
          title={formatMessage({ id: 'components.footer.open' })}
        >
          <Icon icon="window-maximize" />
        </SmallButton>
      )}

      {!conf.footer_is_small && (
        <StyledFooter>
          <Right>
            <b>
              <small>
                <ExternalLink href="/about">madocome</ExternalLink> built by{' '}
                <ExternalLink href="https://nzws.me">@nzws_me</ExternalLink>{' '}
                with 💖
              </small>
            </b>
          </Right>

          <Icon
            icon="window-minimize"
            onClick={toggleSmall}
            title={formatMessage({ id: 'components.footer.close' })}
          />

          <Icon
            icon={conf.hide_side ? 'comment' : 'comment-slash'}
            onClick={() => setConf('hide_side', !conf.hide_side)}
            title={formatMessage({
              id: `components.footer.hide_side.${
                conf.hide_side ? 'open' : 'close'
              }`
            })}
            style={MarginLeft}
          />

          <Icon
            icon={conf.use_top ? 'compress' : 'angle-double-up'}
            onClick={() => setConf('use_top', !conf.use_top)}
            title={formatMessage({
              id: `components.footer.align.to-${
                conf.use_top ? 'center' : 'top'
              }`
            })}
            style={MarginLeft}
          />

          <Icon
            icon="plus"
            onClick={addVideo}
            title={formatMessage({ id: 'components.footer.open_player' })}
            style={MarginLeft}
          />

          <Icon
            icon="share-square"
            onClick={generateLink}
            title={formatMessage({
              id: 'components.footer.generate_link.title'
            })}
            style={MarginLeft}
          />
        </StyledFooter>
      )}
    </>
  );
};

Footer.propTypes = {
  addVideo: PropTypes.func.isRequired
};

export default memo(Footer);
