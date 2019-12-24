import React, { useState, useEffect } from 'react';

import Footer from '../components/footer';
import Player from '../components/youtube-player';
import { getConfig, setConfig } from '../utils/config';
import { selectOneColor } from '../utils/colors';
import { Main, Side, Wrapper } from '../components/layout';
import NoVideo from '../components/no-video';
import styled from 'styled-components';

const youtubeRegExp = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;

const setRatio = length => {
  switch (length) {
    case 0:
    case 1:
      return 1.2;
    case 2:
    case 3:
    case 4:
      return 2.0;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return 3.0;
    case 10:
    case 11:
    case 12:
      return 4.0;
    default:
      return 5.0;
  }
};

const PlayerItem = styled.div({
  maxWidth: '100%',
  position: 'relative'
});

const Index = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [hideSide, setHideSide] = useState(getConfig('hide_side') || false);
  const [videos, setVideos] = useState(getConfig('videos') || []);

  const addVideo = () => {
    if (!navigator.clipboard) {
      return alert('エラー: このブラウザはクリップボードの取得ができません。');
    }
    navigator.clipboard.readText().then(data => {
      const obj = data.match(youtubeRegExp) || [];
      const id = obj[3];
      if (!id) {
        return alert(
          '抽出できませんでした: youtubeのURLをクリップボードにコピーしてください。'
        );
      }
      if (videos.find(video => video.id === id)) {
        return alert('このURLは追加済みです。');
      }
      if (videos.length > 12) {
        return alert('12個まで追加できます。');
      }

      const newVideo = {
        id,
        color: selectOneColor()
      };
      setVideos(prev => {
        prev.push(newVideo);
        prev = prev.map(video => {
          if (!video.pinned) {
            video.ratio = setRatio(prev.length);
          }
          return video;
        });
        setConfig('videos', prev);
        return prev;
      });
    });
  };

  const updateVideo = (id, command, value) => {
    const index = videos.findIndex(video => video.id === id);
    const videoData = videos[index];
    if (index === undefined || !videoData) {
      return alert('この動画IDは存在しません。');
    }

    switch (command) {
      case 'remove':
        return setVideos(prev => {
          prev = prev.filter(video => video.id !== id);
          setConfig('videos', prev);
          return prev;
        });
      case 'move':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index + (value === 'right' ? 2 : -1), 0, videoData);
          prev = prev.filter(video => video);
          setConfig('videos', prev);
          return prev;
        });
      case 'resize':
        return setVideos(prev => {
          prev[index] = {
            ...prev[index],
            ratio: parseFloat(
              (videoData.ratio + (value === 'up' ? -0.1 : 0.1)).toFixed(1)
            ),
            pinned: true
          };
          setConfig('videos', prev);
          return prev;
        });
      case 'reset':
        return setVideos(prev => {
          prev[index] = {
            ...prev[index],
            ratio: setRatio(prev.length),
            pinned: false
          };
          setConfig('videos', prev);
          return prev;
        });
      default:
        return alert('command is not found');
    }
  };

  const toggleHideSide = () =>
    setHideSide(prev => {
      const next = !prev;
      setConfig('hide_side', next);
      return next;
    });

  const widthUpdater = () =>
    setWindowWidth(window.innerWidth - (hideSide ? 0 : 400) - 20);
  useEffect(() => {
    window.addEventListener('resize', widthUpdater, false);
    widthUpdater();
    return () => window.removeEventListener('resize', widthUpdater);
  }, []);
  useEffect(widthUpdater, [hideSide]);

  return (
    <>
      <Wrapper hideSide={hideSide}>
        <Main>
          {videos.map(video => (
            <PlayerItem
              style={{
                width: windowWidth / video.ratio,
                height: (windowWidth / video.ratio / 16) * 9
              }}
              key={video.id}
            >
              <Player video={video} updateVideo={updateVideo} />
            </PlayerItem>
          ))}
          {!videos[0] && <NoVideo />}
        </Main>
        {!hideSide && <Side>WIP:コメントが入る所</Side>}
      </Wrapper>
      <Footer
        toggleHideSide={toggleHideSide}
        hideSide={hideSide}
        addVideo={addVideo}
      />
    </>
  );
};

export default Index;
