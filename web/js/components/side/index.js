import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { lighten } from 'polished';

import { getConfig, setConfig } from '../../utils/config';
import Icon from '../icon';
import { Menu, MenuHr, MenuItem } from '../menu';
import Alert from '../alert';
import Comment from '../comment';
import Post from './post';
import queryBuilder from '../../utils/query-builder';

const Side = styled.div(({ theme, isHide }) => ({
  display: isHide ? 'none' : 'grid',
  height: '100vh',
  gridRow: 1,
  gridColumn: 2,
  background: lighten(0.18, theme.bgBase),
  boxShadow: theme.shadow,
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateColumns: '1fr'
}));

const Selector = styled.div(({ theme }) => ({
  background: lighten(0.25, theme.bgBase),
  boxShadow: theme.shadow,
  gridRow: 1,
  gridColumn: 1,
  padding: '15px 20px',
  cursor: 'pointer'
}));

const Right = styled.div({
  float: 'right'
});

const Comments = styled.div({
  gridRow: 2,
  gridColumn: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column-reverse'
});

const StyledMenu = styled(Menu)({
  bottom: 'initial',
  top: '15px',
  right: '15px',
  width: 400 - 15 * 2
});

const ColorBlock = styled.span(({ bg }) => ({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  background: bg
}));

const commentTokens = {};
const TIMEOUT = 10000;

const insertTop = (element, newValue) => {
  const newElem = element.slice();
  newElem.unshift(newValue);
  return newElem;
};

const Sidebar = props => {
  const { videos, setVideos, isHide } = props;
  const [menuOpened, setMenuOpened] = useState(false);
  const [prevVideos, setPrevVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const users = useState({});
  const [commentGetter, setCommentGetter] = useState({});
  const token = getConfig('access_token', 'live_token');

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
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(({ nextPageToken, items }) => {
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
          setComments(prev => insertTop(prev, items[index]));
          index++;
          if (!items[index]) {
            clearInterval(delay);
          }
        }, TIMEOUT / items.length);
      });
  };

  useEffect(() => {
    if (comments.length > 300) {
      setComments(prev => {
        prev.length = 300;
        return prev;
      });
    }
  }, [comments]);

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
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(({ error, items }) => {
        if (error) {
          return setComments(prev =>
            insertTop(prev, {
              isSystem: true,
              video,
              body: `システムエラー: ${JSON.stringify(error)}`
            })
          );
        }
        if (!items || !items[0] || !items[0].liveStreamingDetails) {
          return setComments(prev =>
            insertTop(prev, {
              video,
              isSystem: true,
              body: `システムエラー: データを取得できませんでした。`
            })
          );
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

        return setComments(prev =>
          insertTop(prev, {
            isSystem: true,
            video,
            body: `チャットの受信を開始しました✨`
          })
        );
      })
      .catch(e => {
        console.error(e);
        return setComments(prev =>
          insertTop(prev, {
            isSystem: true,
            body: `システムエラー: "${video.id}" のデータ取得中にエラーが発生しました。トークンが使用できないか、間違った動画IDの可能性があります。`
          })
        );
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
    return setComments(prev =>
      insertTop(prev, {
        isSystem: true,
        video,
        body: `チャットの受信を終了しました🌙`
      })
    );
  };

  const settings = {
    hide_username: useState(getConfig('comment_hide_username') || false),
    hide_longtext: useState(getConfig('comment_hide_longtext') || false)
  };
  const toggleCommentSettings = key =>
    settings[key][1](prev => {
      const next = !prev;
      setConfig(key, next);
      return next;
    });

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);
  const setVideo = (videoId, data) =>
    setVideos(prev => {
      const index = getVideoIndex(videoId);
      if (index !== -1) return prev;
      const videoData = prev[index];
      prev[index] = null;
      prev.splice(index, 0, {
        ...videoData,
        ...data
      });
      prev = prev.filter(video => video);

      setConfig('videos', prev);
      return prev;
    });

  return (
    <Side isHide={isHide}>
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
              <ColorBlock bg={video.color} /> コメントを受信
            </MenuItem>
          ))}
          {!videos[0] && (
            <MenuItem>
              (視聴開始するとここでコメントのフィルターができます)
            </MenuItem>
          )}
          <MenuHr />
          <MenuItem onClick={() => toggleCommentSettings('hide_username')}>
            <Icon
              icon={settings.hide_username[0] ? 'check-square' : 'square'}
            />{' '}
            ユーザ名を表示しない
          </MenuItem>
          <MenuItem onClick={() => toggleCommentSettings('hide_longtext')}>
            <Icon
              icon={settings.hide_longtext[0] ? 'check-square' : 'square'}
            />{' '}
            長文コメントを畳む
          </MenuItem>
          <MenuHr />
          <MenuItem onClick={toggleMenuOpened}>
            <Icon icon="door-closed" /> 完了
          </MenuItem>
        </StyledMenu>
      )}

      <Selector onClick={toggleMenuOpened}>
        <Right>
          <Icon icon="caret-down" />
        </Right>

        <b>統合タイムライン</b>
      </Selector>

      <Comments>
        {!token && (
          <Alert>
            コメントを表示・投稿するには <Link to="/login">ログイン</Link>{' '}
            してください。
          </Alert>
        )}
        {token &&
          comments.map((comment, key) => (
            <Comment
              comment={comment}
              key={comment.id || key}
              settings={settings}
              users={users}
            />
          ))}
      </Comments>

      <Post videos={videos} />
    </Side>
  );
};

Sidebar.propTypes = {
  videos: PropTypes.array.isRequired,
  setVideos: PropTypes.func.isRequired,
  isHide: PropTypes.bool.isRequired
};

export default Sidebar;
