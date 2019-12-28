import React from 'react';
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

const Footer = ({ addVideo }) => {
  const { conf, setConf } = Container.useContainer();

  const toggleSmall = () => setConf('footer_is_small', !conf.footer_is_small);
  const generateLink = () => {
    const data = encodeURIComponent(getStringData());
    return prompt(
      '今の時点での「どの動画を読み込んでいるか」「大きさなどの設定」を共有できます。次のリンクを他の人に共有してください:',
      `${location.origin}/shared?${data}`
    );
  };

  return (
    <>
      {conf.footer_is_small && (
        <SmallButton onClick={toggleSmall} title="メニューを開く">
          <Icon icon="window-maximize" />
        </SmallButton>
      )}

      {!conf.footer_is_small && (
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
            icon={conf.hide_side ? 'comment' : 'comment-slash'}
            onClick={() => setConf('hide_side', !conf.hide_side)}
            title={`コメントを${conf.hide_side ? '開く' : '閉じる'}`}
            style={MarginLeft}
          />

          <Icon
            icon={conf.use_top ? 'compress' : 'angle-double-up'}
            onClick={() => setConf('use_top', !conf.use_top)}
            title={`動画を${conf.use_top ? '中央' : '上部'}に設置`}
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
  addVideo: PropTypes.func.isRequired
};

export default Footer;
