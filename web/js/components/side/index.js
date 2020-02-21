import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Container from '../../container';
import { getConfig } from '../../utils/config';
import Icon from '../icon';
import Alert from '../alert';
import Comment from '../comment';
import Post from './post';
import { Side, Selector, Right, Comments } from './styles';
import Config from './config';
import api from '../../utils/api';

const commentTokens = {};
const isRunningComment = {};

const insertTop = (element, newValue) => {
  const newElem = element.slice();
  newElem.unshift(newValue);
  return newElem;
};

const relogin = {
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
};

const Sidebar = () => {
  const { videos, conf, setVideo, forceUpdate } = Container.useContainer();
  const [comments, setComments] = useState([]);
  const [menuOpened, setMenuOpened] = useState(false);
  const token = getConfig('access_token', 'live_token');

  const [prevVideos, setPrevVideos] = useState([]);

  const addComment = data => setComments(prev => insertTop(prev, data));

  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);

  const getComment = (videoId, liveChatId) => {
    if (!isRunningComment[videoId]) return;
    const opts = {
      part: 'snippet,authorDetails',
      liveChatId
    };
    if (commentTokens[videoId]) opts.pageToken = commentTokens[videoId];
    else opts.maxResults = 200;

    api({
      path: 'youtube/v3/liveChat/messages',
      data: opts
    }).then(({ nextPageToken, items, error, pollingIntervalMillis }) => {
      if (!pollingIntervalMillis) pollingIntervalMillis = 10 * 1000;
      setTimeout(() => getComment(videoId, liveChatId), pollingIntervalMillis);
      console.log('[comment polling]', videoId, pollingIntervalMillis);

      if (error) {
        console.error(error);
        if (error.errors[0].reason === 'authError') {
          addComment(relogin);
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
      }, pollingIntervalMillis / items.length);
    });
  };

  const addCommentGetter = (video, isForce = false) => {
    if (isRunningComment[video.id]) return;
    if (video.hideComment && !isForce) return;

    api({
      path: 'youtube/v3/videos',
      data: {
        part: 'liveStreamingDetails',
        id: video.id,
        maxResults: 1
      }
    })
      .then(({ error, items }) => {
        if (error) {
          addComment({
            isSystem: true,
            video,
            body: `ERR: ${JSON.stringify(error)}`
          });
          if (error.errors[0].reason === 'authError') {
            addComment(relogin);
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
        forceUpdate();

        isRunningComment[video.id] = true;
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
    if (!isRunningComment[video.id]) return;
    delete isRunningComment[video.id];

    if (getVideoIndex(video.id) !== -1) {
      setVideo(video.id, {
        hideComment: true
      });
      forceUpdate();
    }
    return addComment({
      isSystem: true,
      video,
      body: <FormattedMessage id="components.side.stop_stream" />
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

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  return (
    <Side isHide={conf.hide_side}>
      {menuOpened && (
        <Config
          toggleMenuOpened={toggleMenuOpened}
          setComments={setComments}
          addCommentGetter={addCommentGetter}
          removeCommentGetter={removeCommentGetter}
        />
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
          comments
            .map((comment, key) => (
              <Comment comment={comment} key={comment.id || key} conf={conf} />
            ))
            .filter((v, i) => i < 150)}
      </Comments>

      <Post videos={videos} />
    </Side>
  );
};

export default Sidebar;
