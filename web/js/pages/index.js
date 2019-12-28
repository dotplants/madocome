import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Container from '../container';
import Footer from '../components/footer';
import Player from '../components/youtube-player';
import { getConfig } from '../utils/config';
import { selectOneColor } from '../utils/colors';
import { Main, Wrapper } from '../components/layout';
import NoVideo from '../components/no-video';
import Sidebar from '../components/side';
import { youtubeRegExp, setRatio } from '../utils/env';

const PlayerItem = styled.div({
  maxWidth: '100%',
  position: 'relative'
});

const Index = () => {
  const { videos, setVideos } = Container.useContainer();
  const [windowWidth, setWindowWidth] = useState(0);
  const [hideSide, setHideSide] = useState(getConfig('hide_side') || false);
  const [useTop, setUseTop] = useState(getConfig('main_use_top') || false);

  const addVideo = () => {
    const resolve = data => {
      const obj = data.match(youtubeRegExp) || [];
      const id = obj[3];
      if (!id) {
        return alert(
          '解析できませんでした: youtubeのURLでない可能性があります。'
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
        return prev;
      });
    };

    if ('clipboard' in navigator && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(resolve);
    } else {
      const data = prompt(
        'YouTube URLを貼り付けてください: (クリップボード読み取りに対応していないブラウザ)',
        ''
      );
      resolve(data);
    }
  };

  const updateVideo = (id, command, value) => {
    const index = videos.findIndex(video => video.id === id);
    const videoData = videos[index];
    if (index === undefined || !videoData) {
      return alert('この動画IDは存在しません。');
    }

    switch (command) {
      case 'remove':
        return setVideos(prev => prev.filter(video => video.id !== id));
      case 'move':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index + (value === 'right' ? 2 : -1), 0, videoData);
          prev = prev.filter(video => video);
          return prev;
        });
      case 'resize':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index, 0, {
            ...videoData,
            ratio: parseFloat(
              (videoData.ratio + (value === 'up' ? -0.1 : 0.1)).toFixed(1)
            ),
            pinned: true
          });
          prev = prev.filter(video => video);
          return prev;
        });
      case 'reset':
        return setVideos(prev => {
          prev[index] = null;
          prev.splice(index, 0, {
            ...videoData,
            ratio: setRatio(prev.length),
            pinned: false
          });
          prev = prev.filter(video => video);
          return prev;
        });
      default:
        return alert('command is not found');
    }
  };

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
        <Main useTop={useTop && videos[0]}>
          {videos.map(
            video =>
              video && (
                <PlayerItem
                  style={{
                    width: windowWidth / video.ratio,
                    height: (windowWidth / video.ratio / 16) * 9
                  }}
                  key={video.id}
                >
                  <Player video={video} updateVideo={updateVideo} />
                </PlayerItem>
              )
          )}
          {!videos[0] && <NoVideo addVideo={addVideo} />}
        </Main>
        <Sidebar isHide={hideSide} />
      </Wrapper>
      <Footer
        setUseTop={setUseTop}
        useTop={useTop}
        setHideSide={setHideSide}
        hideSide={hideSide}
        addVideo={addVideo}
      />
    </>
  );
};

export default Index;
