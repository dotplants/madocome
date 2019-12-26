import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';

import ExternalLink from '../external-link';
import Icon from '../icon';
import { getConfig, getStringData, setConfig } from '../../utils/config';

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
  width: '100%'
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

const Footer = ({ setUseTop, useTop, setHideSide, hideSide, addVideo }) => {
  const [isSmall, setIsSmall] = useState(getConfig('footer_is_small') || false);

  const toggleSmall = () =>
    setIsSmall(prev => {
      const next = !prev;
      setConfig('footer_is_small', next);
      return next;
    });

  const toggleHideSide = () =>
    setHideSide(prev => {
      const next = !prev;
      setConfig('hide_side', next);
      return next;
    });

  const toggleUseTop = () =>
    setUseTop(prev => {
      const next = !prev;
      setConfig('main_use_top', next);
      return next;
    });

  const generateLink = () => {
    const data = encodeURIComponent(getStringData());
    return prompt(
      '今の時点での「どの動画を読み込んでいるか」「大きさなどの設定」を共有できます。次のリンクを他の人に共有してください:',
      `${location.origin}/shared?${data}`
    );
  };

  return (
    <>
      {isSmall && (
        <SmallButton onClick={toggleSmall} title="メニューを開く">
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
                <ExternalLink href="https://nzws.me">@nzws_me</ExternalLink>{' '}
                with 💖
              </small>
            </b>
          </Right>

          <Icon
            icon="window-minimize"
            onClick={toggleSmall}
            title="メニューを閉じる"
          />

          <Icon
            icon={hideSide ? 'comment' : 'comment-slash'}
            onClick={toggleHideSide}
            title={`コメントを${hideSide ? '開く' : '閉じる'}`}
            style={MarginLeft}
          />

          <Icon
            icon={useTop ? 'compress' : 'angle-double-up'}
            onClick={toggleUseTop}
            title={`動画を${useTop ? '中央' : '上部'}に設置`}
            style={MarginLeft}
          />

          <Icon
            icon="plus"
            onClick={addVideo}
            title="クリップボードからURLを読み込み"
            style={MarginLeft}
          />

          <Icon
            icon="share-square"
            onClick={generateLink}
            title="現在の状態をリンクにして共有"
            style={MarginLeft}
          />
        </StyledFooter>
      )}
    </>
  );
};

Footer.propTypes = {
  setUseTop: PropTypes.func.isRequired,
  useTop: PropTypes.bool.isRequired,
  setHideSide: PropTypes.func.isRequired,
  hideSide: PropTypes.bool.isRequired,
  addVideo: PropTypes.func.isRequired
};

export default Footer;
