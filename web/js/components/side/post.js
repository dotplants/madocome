import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';

import Icon from '../icon';
import { MenuItem, Menu } from '../menu';
import { getConfig } from '../../utils/config';

const StyledPostWrapper = styled.div({
  background: props => lighten(0.25, props.theme.bgBase),
  boxShadow: props => props.theme.shadow,
  gridRow: 3,
  gridColumn: 1,
  padding: '15px'
});

const Input = styled.input({
  border: 'none',
  color: props => props.theme.textBase,
  display: 'block',
  width: '100%',
  background: 'transparent',
  padding: '3px',
  borderBottom: props => `solid 3px ${lighten(0.35, props.theme.bgBase)}`
});

const Buttons = styled.div({
  marginTop: '10px',
  position: 'relative'
});

const Right = styled.div({
  float: 'right'
});

const PostButton = styled.button({
  border: 'none',
  color: props => props.theme.textBase,
  background: props => props.theme.linkBase,
  boxShadow: props => props.theme.shadow,
  padding: '8px 15px',
  cursor: 'pointer'
});

const PostConfig = styled.button({
  border: 'none',
  color: props => props.theme.text,
  background: 'transparent',
  padding: '8px 15px',
  cursor: 'pointer'
});

const StyledMenu = styled(Menu)({
  right: 'initial',
  left: 0,
  bottom: 0
});

const ColorBlock = styled.span({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  background: props => props.bg
});

const Post = props => {
  const { videos } = props;
  const [value, setValue] = useState('');
  const [commentId, setCommentId] = useState('');
  const [menuOpened, setMenuOpened] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const token = getConfig('access_token', 'live_token');

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);
  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);

  useEffect(() => {
    if (!menuOpened) return;

    window.addEventListener('click', toggleMenuOpened, false);
    return () => window.removeEventListener('click', toggleMenuOpened);
  }, [menuOpened]);

  const post = () => {
    const video = videos[getVideoIndex(commentId)];
    if (!video || !video.liveChatId) {
      return alert(
        '動画が読み込まれていないか、コメントの受信が開始されていません。'
      );
    }
    if (!token) {
      return alert('ログインしてください。');
    }

    setSubmitting(true);
    fetch(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          snippet: {
            liveChatId: video.liveChatId,
            type: 'textMessageEvent',
            textMessageDetails: {
              messageText: value
            }
          }
        })
      }
    )
      .then(response => response.json())
      .then(data => {
        setSubmitting(false);
        if (data.error) {
          console.error(data.error);
          return prompt('Error', JSON.stringify(data.error));
        }

        setValue('');
      })
      .catch(e => {
        setSubmitting(false);
        console.error(e);
        return alert('システムエラー: コメントの投稿に失敗しました。');
      });
  };

  if (commentId && getVideoIndex(commentId) === -1) {
    setCommentId('');
    return <>Loading...</>;
  }

  return (
    <StyledPostWrapper>
      <Input
        type="text"
        value={value}
        placeholder="コメントを投稿..."
        onChange={e => setValue(e.target.value)}
      />

      <Buttons>
        <Right>
          {isSubmitting && <>やってます...</>}
          {!isSubmitting && (
            <PostButton onClick={post}>
              <Icon icon="paper-plane" /> 投稿
            </PostButton>
          )}
        </Right>

        {menuOpened && (
          <StyledMenu>
            {videos.map(video => (
              <MenuItem key={video.id} onClick={() => setCommentId(video.id)}>
                <ColorBlock bg={video.color} /> でコメント
              </MenuItem>
            ))}
          </StyledMenu>
        )}

        <PostConfig onClick={toggleMenuOpened}>
          {commentId && (
            <ColorBlock
              bg={videos[getVideoIndex(commentId)].color}
              style={{ marginRight: '5px' }}
            />
          )}
          {!commentId && <>動画を選択</>}
          <Icon icon="caret-up" />
        </PostConfig>
      </Buttons>
    </StyledPostWrapper>
  );
};

Post.propTypes = {
  videos: PropTypes.array.isRequired
};

export default Post;
