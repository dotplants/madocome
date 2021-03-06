import React, { useState, useEffect, memo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';

import Icon from '../icon';
import { MenuItem, Menu } from '../menu';
import { getConfig, getStringData } from '../../utils/config';
import api from '../../utils/api';

const StyledPostWrapper = styled.div(({ theme }) => ({
  background: lighten(0.25, theme.bgBase),
  boxShadow: theme.shadow,
  gridRow: 3,
  gridColumn: 1,
  padding: '15px',
  zIndex: 2
}));

const Input = styled.input(({ theme }) => ({
  border: 'none',
  color: theme.textBase,
  display: 'block',
  width: '100%',
  background: 'transparent',
  padding: '3px',
  borderBottom: `solid 3px ${lighten(0.35, theme.bgBase)}`
}));

const Buttons = styled.div({
  marginTop: '10px',
  position: 'relative'
});

const Right = styled.div({
  float: 'right'
});

const PostButton = styled.button(({ theme }) => ({
  border: 'none',
  color: theme.textBase,
  background: theme.linkBase,
  boxShadow: theme.shadow,
  padding: '8px 15px',
  cursor: 'pointer'
}));

const PostConfig = styled.button(({ theme }) => ({
  border: 'none',
  color: theme.text,
  background: 'transparent',
  padding: '8px 15px',
  cursor: 'pointer'
}));

const StyledMenu = styled(Menu)({
  left: 0,
  bottom: 0,
  '> button': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
});

const ColorBlock = styled.span(({ bg }) => ({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  background: bg
}));

const Post = ({ videos, liveDetails }) => {
  const { formatMessage } = useIntl();
  const [value, setValue] = useState('');
  const [commentId, setCommentId] = useState('');
  const [channelName, setChannelName] = useState('');
  const [menuOpened, setMenuOpened] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const details = JSON.parse(liveDetails);

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);
  const getVideoIndex = videoId => videos.findIndex(({ id }) => id === videoId);

  useEffect(() => {
    if (!menuOpened) return;

    window.addEventListener('click', toggleMenuOpened, false);
    return () => window.removeEventListener('click', toggleMenuOpened);
  }, [menuOpened]);

  const checkName = () => {
    api({
      path: 'youtube/v3/channels',
      data: {
        part: 'snippet',
        maxResults: 1,
        mine: true
      }
    }).then(({ error, items }) => {
      if (error) {
        return;
      }
      const data = items[0].snippet;
      console.log(data);
      setChannelName(data.title);
    });
  };

  useEffect(() => {
    const onKeyDown = ({ ctrlKey, keyCode, metaKey }) => {
      // Enter + (ctrl / meta)
      if (keyCode === 13 && (ctrlKey || metaKey)) {
        post();
      }
    };

    getStringData('live_token') && checkName();
    window.addEventListener('keydown', onKeyDown, false);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const post = () => {
    const video = videos[getVideoIndex(commentId)];
    const token = getConfig('access_token', 'live_token');
    if (!video || !video.liveChatId) {
      return alert(formatMessage({ id: 'components.side.post.not_found' }));
    }
    if (!token) {
      return alert(formatMessage({ id: 'components.side.post.please_login' }));
    }

    setSubmitting(true);
    api({
      method: 'POST',
      path: 'youtube/v3/liveChat/messages?part=snippet',
      data: {
        snippet: {
          liveChatId: video.liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: value
          }
        }
      }
    })
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
        return alert(formatMessage({ id: 'components.side.post.error' }));
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
        placeholder={formatMessage(
          { id: 'components.side.post.placeholder' },
          { name: channelName, channel: details[commentId]?.channel }
        )}
        onChange={e => setValue(e.target.value)}
      />

      <Buttons>
        <Right>
          {isSubmitting && (
            <FormattedMessage id="components.side.post.posting_now" />
          )}
          {!isSubmitting && (
            <PostButton onClick={post}>
              <Icon icon="paper-plane" />{' '}
              <FormattedMessage id="components.side.post.post" />
            </PostButton>
          )}
        </Right>

        {menuOpened && (
          <StyledMenu>
            {videos.map(video => (
              <MenuItem key={video.id} onClick={() => setCommentId(video.id)}>
                <ColorBlock bg={video.color} />{' '}
                <b>{details[video.id]?.channel}</b>
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
          {!commentId && <FormattedMessage id="components.side.post.select" />}
          <Icon icon="caret-up" />
        </PostConfig>
      </Buttons>
    </StyledPostWrapper>
  );
};

Post.propTypes = {
  videos: PropTypes.array.isRequired,
  liveDetails: PropTypes.string
};

export default memo(Post);
