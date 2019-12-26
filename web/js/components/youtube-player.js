import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import styled from 'styled-components';
import Icon from './icon';
import { Menu, MenuItem, MenuHr } from './menu';

const MenuButton = styled.div(({ bg }) => ({
  cursor: 'pointer',
  width: '25px',
  height: '25px',
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  background: bg
}));

const Player = ({ video, updateVideo }) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  useEffect(() => {
    if (!menuOpened) return;

    window.addEventListener('click', toggleMenuOpened, false);
    return () => window.removeEventListener('click', toggleMenuOpened);
  }, [menuOpened]);

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
            <Icon icon="power-off" /> 削除
          </MenuItem>
          <MenuHr />
          <MenuItem onClick={() => updateVideo(video.id, 'move', 'right')}>
            <Icon icon="arrow-right" /> 次に移動
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'move', 'left')}>
            <Icon icon="arrow-left" /> 前に移動
          </MenuItem>
          <MenuHr />
          <MenuItem onClick={() => updateVideo(video.id, 'resize', 'up')}>
            <Icon icon="expand-alt" /> 少し大きく
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'resize', 'down')}>
            <Icon icon="compress-alt" /> 少し小さく
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'reset')}>
            <Icon icon="arrows-alt-h" /> リセット
          </MenuItem>
        </Menu>
      )}
      <MenuButton bg={video.color} onClick={toggleMenuOpened} />
    </>
  );
};

Player.propTypes = {
  video: PropTypes.object.isRequired,
  updateVideo: PropTypes.func.isRequired
};

export default Player;
