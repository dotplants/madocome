import React, { useEffect, memo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import styled from 'styled-components';
import Container from '../container';
import Icon from './icon';
import { setRatio } from '../utils/env';
import { lighten } from 'polished';
import api from '../utils/api';

const PlayerItem = styled.div(({ width }) => ({
  maxWidth: '100%',
  position: 'relative',
  width,
  height: (width / 16) * 9 + 26
}));

const PlayerWrapper = styled.div({
  height: 'calc(100% - 26px)'
});

const Footer = styled.div(({ theme }) => ({
  width: '100%',
  background: lighten(0.2, theme.bgBase),
  display: 'flex'
}));

const FooterItem = styled.div(({ theme, bg, noBtn }) => ({
  padding: '5px',
  cursor: !noBtn && 'pointer',
  fontSize: '0.95rem',
  color: theme.text,
  ':hover': !noBtn && {
    background: lighten(0.4, theme.bgBase)
  },
  background: bg,
  width: bg && '20px'
}));

const FooterPartition = styled.div({
  marginLeft: 'auto'
});

const Player = ({ video, width }) => {
  const { formatMessage } = useIntl();
  const { videos, setVideos } = Container.useContainer();
  const [viewers, setViewers] = useState('');
  const index = videos.findIndex(v => v && v.id === video.id);

  useEffect(() => {
    const updateViewer = () => {
      api({
        path: 'youtube/v3/videos',
        data: {
          part: 'liveStreamingDetails',
          id: video.id,
          maxResults: 1
        }
      }).then(({ error, items }) => {
        if (error) {
          return;
        }
        if (!items || !items[0] || !items[0].liveStreamingDetails) {
          return;
        }

        const data = items[0].liveStreamingDetails;
        console.log(video.id, data);
        setViewers(data.concurrentViewers);
      });
    };
    const interval = setInterval(updateViewer, 1000 * 60);
    updateViewer();

    return () => clearInterval(interval);
  }, []);

  const updateVideo = (id, command, value) => {
    if (index === undefined) {
      return alert(formatMessage({ id: 'components.player.not_found' }));
    }

    switch (command) {
      case 'remove':
        return setVideos(prev => {
          const next = prev.filter(video => video.id !== id);
          return next.map(video => {
            if (!video.pinned) {
              video.ratio = setRatio(next.length);
            }
            return video;
          });
        });
      case 'move':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index + (value === 'right' ? 2 : -1), 0, video);
          prev = prev.filter(video => video);
          return prev;
        });
      case 'resize':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index, 0, {
            ...video,
            ratio: parseFloat(
              (video.ratio + (value === 'up' ? -0.1 : 0.1)).toFixed(1)
            ),
            pinned: true
          });
          prev = prev.filter(video => video);
          return prev;
        });
      case 'reset':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index, 0, {
            ...video,
            ratio: setRatio(prev.length),
            pinned: false
          });
          prev = prev.filter(video => video);
          return prev;
        });
      default:
        return alert('command is not found');
    }
  };

  return (
    <PlayerItem width={width / video.ratio}>
      <PlayerWrapper>
        <YouTube
          videoId={video.id}
          containerClassName="size-max"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0, // ガイドライン遵守の為
              allowfullscreen: 1
            }
          }}
        />
      </PlayerWrapper>

      <Footer>
        <FooterItem
          title={formatMessage({ id: 'components.player.color' })}
          bg={video.color}
          noBtn
        />
        <FooterItem
          noBtn
          title={formatMessage({ id: 'components.player.viewers' })}
        >
          <Icon icon="users" style={{ marginRight: '3px' }} />
          {viewers || '?'}
        </FooterItem>

        <FooterPartition />

        <FooterItem
          onClick={() => updateVideo(video.id, 'resize', 'up')}
          title={formatMessage({ id: 'components.player.larger' })}
        >
          <Icon icon="expand-alt" />
        </FooterItem>
        <FooterItem
          onClick={() => updateVideo(video.id, 'resize', 'down')}
          title={formatMessage({ id: 'components.player.smaller' })}
        >
          <Icon icon="compress-alt" />
        </FooterItem>
        <FooterItem
          onClick={() => updateVideo(video.id, 'reset')}
          title={formatMessage({ id: 'components.player.reset' })}
        >
          <Icon icon="arrows-alt-h" />
        </FooterItem>

        {videos.length !== index + 1 && (
          <FooterItem
            onClick={() => updateVideo(video.id, 'move', 'right')}
            title={formatMessage({ id: 'components.player.move-to-right' })}
          >
            <Icon icon="arrow-right" />
          </FooterItem>
        )}
        {index !== 0 && (
          <FooterItem
            onClick={() => updateVideo(video.id, 'move', 'left')}
            title={formatMessage({ id: 'components.player.move-to-left' })}
          >
            <Icon icon="arrow-left" />
          </FooterItem>
        )}

        <FooterItem
          onClick={() => updateVideo(video.id, 'remove')}
          title={formatMessage({ id: 'components.player.delete' })}
        >
          <Icon icon="power-off" />
        </FooterItem>
      </Footer>
    </PlayerItem>
  );
};

Player.propTypes = {
  video: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired
};

export default memo(Player);
