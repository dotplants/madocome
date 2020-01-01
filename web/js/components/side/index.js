import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Container from '../../container';
import { getConfig } from '../../utils/config';
import Icon from '../icon';
import { MenuHr, MenuItem } from '../menu';
import Alert from '../alert';
import Comment from '../comment';
import Post from './post';
import queryBuilder from '../../utils/query-builder';
import {
  Side,
  Selector,
  Right,
  Comments,
  StyledMenu,
  ColorBlock
} from './styles';

const commentTokens = {};
const TIMEOUT = 10000;

const Sidebar = () => {
  const {
    comments,
    videos,
    setVideo,
    addComment,
    conf,
    setConf
  } = Container.useContainer();
  const [menuOpened, setMenuOpened] = useState(false);
  const [prevVideos, setPrevVideos] = useState([]);
  const [commentGetter, setCommentGetter] = useState({});
  const token = getConfig('access_token', 'live_token');

  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);
  const getComment = (videoId, liveChatId) => {
    const opts = {
      part: 'snippet,authorDetails',
      liveChatId
    };
    if (commentTokens[videoId]) opts.pageToken = commentTokens[videoId];
    else opts.maxResults = 200;
    const query = queryBuilder(opts);

    fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getConfig('access_token', 'live_token')}`
      }
    })
      .then(response => response.json())
      .then(({ nextPageToken, items, error }) => {
        if (error) {
          console.error(error);
          if (error.errors[0].reason === 'authError') {
            addComment({
              isSystem: true,
              body: (
                <FormattedMessage
                  id="components.side.please_relogin"
                  values={{
                    login: (
                      <a href="/api/auth-login">
                        <FormattedMessage id="components.side.login" />
                      </a>
                    )
                  }}
                />
              )
            });
          }
          return;
        }
        if (nextPageToken) {
          commentTokens[videoId] = nextPageToken;
        }
        if (!items || !items[0]) {
          return;
        }

        const i = getVideoIndex(videoId);

        items.map(item => {
          item.video = videos[i];
          item.id = Math.random()
            .toString(36)
            .slice(-8);
          return item;
        });

        let index = 0;
        const delay = setInterval(() => {
          addComment(items[index]);
          index++;
          if (!items[index]) {
            clearInterval(delay);
          }
        }, TIMEOUT / items.length);
      });
  };

  useEffect(() => {
    const hasNullData = videos.find(v => !v);
    if (hasNullData) {
      return;
    }
    const newVideo = videos.filter(
      ({ id }) => !prevVideos.find(video => video.id === id)
    );
    const removedVideo = prevVideos.filter(
      ({ id }) => !videos.find(video => video.id === id)
    );

    newVideo.forEach(addCommentGetter);
    removedVideo.forEach(removeCommentGetter);

    setPrevVideos(JSON.parse(JSON.stringify(videos)));
  }, [videos]);

  const addCommentGetter = (video, isForce = false) => {
    if (commentGetter[video.id]) return;
    if (video.hideComment && !isForce) return;

    const query = queryBuilder({
      part: 'liveStreamingDetails',
      id: video.id,
      maxResults: 1
    });

    fetch(`https://www.googleapis.com/youtube/v3/videos?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getConfig('access_token', 'live_token')}`
      }
    })
      .then(response => response.json())
      .then(({ error, items }) => {
        if (error) {
          addComment({
            isSystem: true,
            video,
            body: `ERR: ${JSON.stringify(error)}`
          });
          if (error.errors[0].reason === 'authError') {
            addComment({
              isSystem: true,
              body: (
                <FormattedMessage
                  id="components.side.please_relogin"
                  values={{
                    login: (
                      <a href="/api/auth-login">
                        <FormattedMessage id="components.side.login" />
                      </a>
                    )
                  }}
                />
              )
            });
          }
          return;
        }
        if (!items || !items[0] || !items[0].liveStreamingDetails) {
          return addComment({
            video,
            isSystem: true,
            body: <FormattedMessage id="components.side.error" />
          });
        }

        const liveChatId = items[0].liveStreamingDetails.activeLiveChatId;
        setVideo(video.id, {
          liveChatId,
          hideComment: false
        });
        setCommentGetter(prev => ({
          ...prev,
          [video.id]: setInterval(
            () => getComment(video.id, liveChatId),
            TIMEOUT
          )
        }));
        getComment(video.id, liveChatId);

        return addComment({
          isSystem: true,
          video,
          body: <FormattedMessage id="components.side.start_stream" />
        });
      })
      .catch(e => {
        console.error(e);
        return addComment({
          isSystem: true,
          video,
          body: <FormattedMessage id="components.side.error" />
        });
      });
  };

  const removeCommentGetter = video => {
    if (!commentGetter[video.id]) return;
    clearInterval(commentGetter[video.id]);
    setCommentGetter(prev => ({
      ...prev,
      [video.id]: null
    }));
    if (getVideoIndex(video.id) !== -1) {
      setVideo(video.id, {
        hideComment: true
      });
    }
    return addComment({
      isSystem: true,
      video,
      body: <FormattedMessage id="components.side.stop_stream" />
    });
  };

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  return (
    <Side isHide={conf.hide_side}>
      {menuOpened && (
        <StyledMenu>
          {videos.map(video => (
            <MenuItem
              onClick={() =>
                video.hideComment
                  ? addCommentGetter(video, true)
                  : removeCommentGetter(video)
              }
              key={video.id}
            >
              <Icon icon={!video.hideComment ? 'check-square' : 'square'} />{' '}
              <ColorBlock bg={video.color} />{' '}
              <FormattedMessage id="components.side.menu.recive" />
            </MenuItem>
          ))}
          {!videos[0] && (
            <MenuItem>
              <FormattedMessage id="components.side.menu.note" />
            </MenuItem>
          )}
          <MenuHr />
          <MenuItem
            onClick={() => setConf('hide_username', !conf.hide_username)}
          >
            <Icon icon={conf.hide_username ? 'check-square' : 'square'} />{' '}
            <FormattedMessage id="components.side.menu.hide_username" />
          </MenuItem>
          <MenuItem
            onClick={() => setConf('hide_longtext', !conf.hide_longtext)}
          >
            <Icon icon={conf.hide_longtext ? 'check-square' : 'square'} />{' '}
            <FormattedMessage id="components.side.menu.hide_longtext" />
          </MenuItem>
          <MenuHr />
          <MenuItem onClick={toggleMenuOpened}>
            <Icon icon="door-closed" />{' '}
            <FormattedMessage id="components.side.menu.done" />
          </MenuItem>
        </StyledMenu>
      )}

      <Selector onClick={toggleMenuOpened}>
        <Right>
          <Icon icon="caret-down" />
        </Right>

        <b>
          <FormattedMessage id="title" />
        </b>
      </Selector>

      <Comments>
        {!token && (
          <Alert>
            <FormattedMessage
              id="components.side.please_login"
              values={{
                login: (
                  <a href="/api/auth-login">
                    <FormattedMessage id="components.side.login" />
                  </a>
                )
              }}
            />
          </Alert>
        )}
        {token &&
          comments.map((comment, key) => (
            <Comment comment={comment} key={comment.id || key} />
          ))}
      </Comments>

      <Post videos={videos} />
    </Side>
  );
};

export default Sidebar;
