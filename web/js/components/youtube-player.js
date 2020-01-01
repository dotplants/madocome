import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import styled from 'styled-components';
import Container from '../container';
import Icon from './icon';
import { Menu, MenuItem, MenuHr } from './menu';
import { setRatio } from '../utils/env';

const MenuButton = styled.div(({ bg }) => ({
  cursor: 'pointer',
  width: '25px',
  height: '25px',
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  background: bg
}));

const Player = ({ video }) => {
  const { formatMessage } = useIntl();
  const { videos, setVideos } = Container.useContainer();
  const [menuOpened, setMenuOpened] = useState(false);
  const index = videos.findIndex(v => v && v.id === video.id);

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  useEffect(() => {
    if (!menuOpened) return;

    window.addEventListener('click', toggleMenuOpened, false);
    return () => window.removeEventListener('click', toggleMenuOpened);
  }, [menuOpened]);

  const updateVideo = (id, command, value) => {
    if (index === undefined) {
      return alert(formatMessage({ id: 'components.player.not_found' }));
    }

    switch (command) {
      case 'remove':
        return setVideos(prev => prev.filter(video => video.id !== id));
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
    <>
      <YouTube
        videoId={video.id}
        containerClassName="size-max"
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            allowfullscreen: 1
          }
        }}
      />
      {menuOpened && (
        <Menu>
          <MenuItem onClick={() => updateVideo(video.id, 'remove')}>
            <Icon icon="power-off" />{' '}
            <FormattedMessage id="components.player.delete" />
          </MenuItem>
          <MenuHr />
          {videos.length !== index + 1 && (
            <MenuItem onClick={() => updateVideo(video.id, 'move', 'right')}>
              <Icon icon="arrow-right" />{' '}
              <FormattedMessage id="components.player.move-to-right" />
            </MenuItem>
          )}
          {index !== 0 && (
            <MenuItem onClick={() => updateVideo(video.id, 'move', 'left')}>
              <Icon icon="arrow-left" />{' '}
              <FormattedMessage id="components.player.move-to-left" />
            </MenuItem>
          )}
          <MenuHr />
          <MenuItem onClick={() => updateVideo(video.id, 'resize', 'up')}>
            <Icon icon="expand-alt" />{' '}
            <FormattedMessage id="components.player.larger" />
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'resize', 'down')}>
            <Icon icon="compress-alt" />{' '}
            <FormattedMessage id="components.player.smaller" />
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'reset')}>
            <Icon icon="arrows-alt-h" />{' '}
            <FormattedMessage id="components.player.reset" />
          </MenuItem>
        </Menu>
      )}
      <MenuButton bg={video.color} onClick={toggleMenuOpened} />
    </>
  );
};

Player.propTypes = {
  video: PropTypes.object.isRequired
};

export default Player;
