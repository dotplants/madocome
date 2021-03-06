import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Container from '../../container';
import Icon from '../icon';
import Post from './post';
import { Side, Selector, Right, PostWrapper, ScrollToBottom } from './styles';
import Config from './config';
import api from '../../utils/api';
import Comments from './comments';

const commentTokens = {};
const isRunningComment = {};

const insertTop = (element, newValue) => {
  const newElem = element.slice();
  newElem.unshift(newValue);
  return newElem;
};

const reasonText = reason => {
  switch (reason) {
    case 'authError':
      return {
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
    case 'dailyLimitExceeded':
    case 'quotaExceeded':
      return {
        isSystem: true,
        body: <FormattedMessage id="errors.limit" />
      };
    case 'liveChatNotFound':
      return {
        isSystem: true,
        body: <FormattedMessage id="errors.not_found" />
      };
    default:
      return {
        isSystem: true,
        body: <FormattedMessage id="errors.default" />
      };
  }
};

const Sidebar = () => {
  const { formatMessage } = useIntl();
  const {
    videos,
    conf,
    setVideo,
    setVideos,
    forceUpdate
  } = Container.useContainer();
  const [comments, setComments] = useState([]);
  const [menuOpened, setMenuOpened] = useState(false);
  const [prevVideos, setPrevVideos] = useState([]);
  const [liveDetails, setLiveDetails] = useState('{}');

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
        addComment(reasonText(error.errors[0].reason));
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
        item.id = Math.random().toString(36).slice(-8);
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

  const getLiveStatus = videoId => {
    if (!isRunningComment[videoId]) return;

    api({
      path: 'youtube/v3/videos',
      data: {
        part: 'liveStreamingDetails,snippet',
        id: videoId,
        maxResults: 1
      }
    }).then(({ error, items }) => {
      if (error) {
        return;
      }
      if (!items || !items[0] || !items[0].liveStreamingDetails) {
        return;
      }
      setTimeout(() => getLiveStatus(videoId), 1000 * 60);

      const data = items[0].liveStreamingDetails;
      console.log(videoId, items[0]);

      setLiveDetails(prev => {
        prev = JSON.parse(prev);
        prev[videoId] = {
          title: items[0].snippet.title,
          viewers: data.concurrentViewers,
          channel: items[0].snippet.channelTitle
        };
        return JSON.stringify(prev);
      });
    });
  };

  const removeVideo = v => {
    setVideos(prev => prev.filter(video => video.id !== v.id));

    if (!isRunningComment[v.id]) return;
    delete isRunningComment[v.id];

    return addComment({
      isSystem: true,
      video: v,
      body: <FormattedMessage id="components.side.stop_stream" />
    });
  };

  const addCommentGetter = video => {
    if (isRunningComment[video.id]) return;

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
          addComment(reasonText(error.errors[0].reason));
          return;
        }

        const liveChatId =
          items[0] && items[0]?.liveStreamingDetails?.activeLiveChatId;
        if (!liveChatId) {
          removeVideo(video);
          return alert(formatMessage({ id: 'errors.no_livestream' }));
        }

        setVideo(video.id, {
          liveChatId
        });
        forceUpdate();

        isRunningComment[video.id] = true;
        getComment(video.id, liveChatId);
        getLiveStatus(video.id);

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
          body: <FormattedMessage id="errors.default" />
        });
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

    newVideo.forEach(addCommentGetter);

    setPrevVideos(JSON.parse(JSON.stringify(videos)));
  }, [videos]);

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  const [isScrolling, setIsScrolling] = useState(false);
  const commentsRef = useRef(null);
  const scrollToBottom = () =>
    (commentsRef.current.scrollTop = commentsRef.current.scrollHeight + 999);
  const onScroll = e => {
    const elem = e.target;
    const isScrollingNow =
      elem.scrollHeight - elem.clientHeight - elem.scrollTop > 50;
    if (isScrolling !== isScrollingNow) {
      setIsScrolling(isScrollingNow);
    }
  };

  return (
    <Side isHide={conf.hide_side}>
      {menuOpened && (
        <Config
          toggleMenuOpened={toggleMenuOpened}
          removeVideo={removeVideo}
          liveDetails={liveDetails}
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

      <Comments comments={comments} onScroll={onScroll} divRef={commentsRef} />

      <PostWrapper>
        <Post videos={videos} liveDetails={liveDetails} />
        <ScrollToBottom isScrolling={isScrolling} onClick={scrollToBottom}>
          <Icon icon="arrow-down" />
        </ScrollToBottom>
      </PostWrapper>
    </Side>
  );
};

export default Sidebar;
