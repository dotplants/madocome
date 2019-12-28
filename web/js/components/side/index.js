import React, { useState, useEffect } from 'react';

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
                <>
                  トークンの有効期限が切れているようです。
                  <a href="/login">ログイン</a>し直してください。
                </>
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
            body: `システムエラー: ${JSON.stringify(error)}`
          });
          if (error.errors[0].reason === 'authError') {
            addComment({
              isSystem: true,
              body: (
                <>
                  トークンの有効期限が切れているようです。
                  <a href="/login">ログイン</a>し直してください。
                </>
              )
            });
          }
          return;
        }
        if (!items || !items[0] || !items[0].liveStreamingDetails) {
          return addComment({
            video,
            isSystem: true,
            body: `システムエラー: データを取得できませんでした。`
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
          body: `コメントの受信を開始しました✨`
        });
      })
      .catch(e => {
        console.error(e);
        return addComment({
          isSystem: true,
          body: `システムエラー: "${video.id}" のデータ取得中にエラーが発生しました。トークンが使用できないか、間違った動画IDの可能性があります。`
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
      body: `コメントの受信を終了しました🌙`
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
              <ColorBlock bg={video.color} /> コメントを受信
            </MenuItem>
          ))}
          {!videos[0] && (
            <MenuItem>
              (視聴開始するとここでコメントのフィルターができます)
            </MenuItem>
          )}
          <MenuHr />
          <MenuItem
            onClick={() => setConf('hide_username', !conf.hide_username)}
          >
            <Icon icon={conf.hide_username ? 'check-square' : 'square'} />{' '}
            ユーザ名を表示しない
          </MenuItem>
          <MenuItem
            onClick={() => setConf('hide_longtext', !conf.hide_longtext)}
          >
            <Icon icon={conf.hide_longtext ? 'check-square' : 'square'} />{' '}
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
            コメントを表示・投稿するには<a href="/api/auth-login">ログイン</a>
            してください。
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
