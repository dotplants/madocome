import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import styled from 'styled-components';
import { lighten } from 'polished';
import Icon from './icon';

const MenuButton = styled.div({
  cursor: 'pointer',
  width: '25px',
  height: '25px',
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  background: props => props.bg
});

const Menu = styled.div({
  zIndex: 3,
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  padding: '10px 0',
  background: props => lighten(0.2, props.theme.bgBase)
});

const MenuItem = styled.button({
  display: 'block',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  color: props => props.theme.text,
  background: props => lighten(0.2, props.theme.bgBase),
  border: 'none',
  ':hover': {
    background: props => lighten(0.4, props.theme.bgBase)
  }
});

const MenuHr = styled.div({
  width: '100%',
  height: '10px'
});

const Player = props => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { video, updateVideo } = props;

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
            <Icon icon="arrow-right" /> 右に移動
          </MenuItem>
          <MenuItem onClick={() => updateVideo(video.id, 'move', 'left')}>
            <Icon icon="arrow-left" /> 左に移動
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
