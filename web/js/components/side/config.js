import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ColorBlock, StyledMenu } from './styles';
import { MenuHr, MenuItem } from '../menu';
import Icon from '../icon';
import Container from '../../container';
import api from '../../utils/api';

const commentTokens = {};
const TIMEOUT = 10 * 1000;

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

const Config = ({ setComments, toggleMenuOpened }) => {
  const {
    videos,
    conf,
    setConf,
    setVideo,
    forceUpdate
  } = Container.useContainer();
  const [prevVideos, setPrevVideos] = useState([]);
  const [commentGetter, setCommentGetter] = useState({});

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

  const addComment = data => setComments(prev => insertTop(prev, data));

  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);

  const getComment = (videoId, liveChatId) => {
    const opts = {
      part: 'snippet,authorDetails',
      liveChatId
    };
    if (commentTokens[videoId]) opts.pageToken = commentTokens[videoId];
    else opts.maxResults = 200;

    api({
      path: 'youtube/v3/liveChat/messages',
      data: opts
    }).then(({ nextPageToken, items, error }) => {
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
      }, TIMEOUT / items.length);
    });
  };

  const addCommentGetter = (video, isForce = false) => {
    if (commentGetter[video.id]) return;
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
      forceUpdate();
    }
    return addComment({
      isSystem: true,
      video,
      body: <FormattedMessage id="components.side.stop_stream" />
    });
  };

  return (
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
          <small>
            <FormattedMessage id="components.side.menu.note" />
          </small>
        </MenuItem>
      )}
      <MenuHr />
      <MenuItem onClick={() => setConf('hide_username', !conf.hide_username)}>
        <Icon icon={conf.hide_username ? 'check-square' : 'square'} />{' '}
        <FormattedMessage id="components.side.menu.hide_username" />
      </MenuItem>
      <MenuItem onClick={() => setConf('hide_longtext', !conf.hide_longtext)}>
        <Icon icon={conf.hide_longtext ? 'check-square' : 'square'} />{' '}
        <FormattedMessage id="components.side.menu.hide_longtext" />
      </MenuItem>
      <MenuHr />
      <MenuItem>
        <b>
          <FormattedMessage id="components.side.menu.show_user.title" />
        </b>
        <br />
        <small>
          <FormattedMessage id="components.side.menu.show_user.note" />
        </small>
      </MenuItem>

      {['owner', 'mod', 'verified', 'sponsor', 'anonymous'].map(id => (
        <MenuItem
          key={id}
          onClick={() => setConf(`hide_${id}`, !conf[`hide_${id}`])}
        >
          <Icon icon={conf[`hide_${id}`] ? 'square' : 'check-square'} />{' '}
          <FormattedMessage id={`components.side.menu.show_user.${id}`} />
        </MenuItem>
      ))}
      <MenuHr />
      <MenuItem onClick={toggleMenuOpened}>
        <Icon icon="door-closed" />{' '}
        <FormattedMessage id="components.side.menu.done" />
      </MenuItem>
    </StyledMenu>
  );
};

Config.propTypes = {
  setComments: PropTypes.array.isRequired,
  toggleMenuOpened: PropTypes.func.isRequired
};

export default Config;
