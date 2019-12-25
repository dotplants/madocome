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

const Side = styled.div({
  height: '100vh',
  gridRow: 1,
  gridColumn: 2,
  background: props => lighten(0.18, props.theme.bgBase),
  boxShadow: props => props.theme.shadow,
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateColumns: '1fr'
});

const Selector = styled.div({
  background: props => lighten(0.25, props.theme.bgBase),
  boxShadow: props => props.theme.shadow,
  gridRow: 1,
  gridColumn: 1,
  padding: '15px 20px',
  cursor: 'pointer'
});

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

const StyledPostWrapper = styled.div({
  background: props => lighten(0.25, props.theme.bgBase),
  boxShadow: props => props.theme.shadow,
  gridRow: 3,
  gridColumn: 1,
  padding: '15px'
});

const StyledMenu = styled(Menu)({
  bottom: 'initial',
  top: '15px',
  right: '15px',
  width: 400 - 15 * 2
});

const ColorBlock = styled.span({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  background: props => props.bg
});

const commentGetter = {};
const commentTokens = {};
const TIMEOUT = 10000;

const insertTop = (element, newValue) => {
  const newElem = element.slice();
  newElem.unshift(newValue);
  return newElem;
};

const Sidebar = props => {
  const { videos, setVideos } = props;
  const [menuOpened, setMenuOpened] = useState(false);
  const [prevVideos, setPrevVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const token = getConfig('access_token', 'live_token');

  const delayAdd = (items, index = 0, wait = 100) => {
    if (items[index]) {
      setComments(prev => insertTop(prev, items[index]));
    }
    if (items[index + 1]) {
      setTimeout(() => delayAdd(items, index + 1), wait);
    }
  };

  const getComment = (videoId, liveChatId) => {
    let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet,authorDetails&liveChatId=${liveChatId}`;
    if (commentTokens[videoId]) {
      url += `&pageToken=${commentTokens[videoId]}`;
    } else {
      url += `&maxResults=200`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.nextPageToken) {
          commentTokens[videoId] = data.nextPageToken;
        }
        if (!data.items) {
          return;
        }

        const i = getVideoIndex(videoId);

        data.items.map(item => {
          item.video = videos[i];
          item.id = Math.random()
            .toString(36)
            .slice(-8);
          return item;
        });
        delayAdd(data.items, 0, TIMEOUT / data.items);
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
      v => !prevVideos.find(video => video.id === v.id)
    );
    const removedVideo = prevVideos.filter(
      v => !videos.find(video => video.id === v.id)
    );

    newVideo.forEach(video => {
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${video.id}&maxResults=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          if (
            !data.items ||
            !data.items[0] ||
            !data.items[0].liveStreamingDetails
          ) {
            return setComments(prev =>
              insertTop(prev, {
                isSystem: true,
                body: `システムエラー: "${video.id}" のデータを取得できませんでした。`
              })
            );
          }

          commentGetter[video.id] = setInterval(
            () =>
              getComment(
                video.id,
                data.items[0].liveStreamingDetails.activeLiveChatId
              ),
            TIMEOUT
          );

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
    });
    removedVideo.forEach(video => {
      clearInterval(commentGetter[video.id]);
      return setComments(prev =>
        insertTop(prev, {
          isSystem: true,
          video,
          body: `チャットの受信を終了しました🌙`
        })
      );
    });

    setPrevVideos(JSON.parse(JSON.stringify(videos)));
  }, [videos]);

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
    <Side>
      {menuOpened && (
        <StyledMenu>
          {videos.map(video => (
            <MenuItem
              onClick={() =>
                setVideo(video.id, {
                  hideComment: !videos[getVideoIndex(video.id)].hideComment
                })
              }
              key={video.id}
            >
              <Icon
                icon={
                  !videos[getVideoIndex(video.id)].hideComment
                    ? 'check-square'
                    : 'square'
                }
              />{' '}
              <ColorBlock bg={video.color} /> コメントを表示
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
              videos={videos}
            />
          ))}
      </Comments>

      <StyledPostWrapper>投稿ボックス [WIP]</StyledPostWrapper>
    </Side>
  );
};

Sidebar.propTypes = {
  videos: PropTypes.array.isRequired,
  setVideos: PropTypes.func.isRequired
};

export default Sidebar;
