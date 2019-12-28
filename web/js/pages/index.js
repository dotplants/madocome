import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Container from '../container';
import Footer from '../components/footer';
import Player from '../components/youtube-player';
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
  const { videos, setVideos, conf } = Container.useContainer();
  const [windowWidth, setWindowWidth] = useState(0);

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

  const widthUpdater = () =>
    setWindowWidth(window.innerWidth - (conf.hide_side ? 0 : 400) - 20);
  useEffect(() => {
    window.addEventListener('resize', widthUpdater, false);
    widthUpdater();
    return () => window.removeEventListener('resize', widthUpdater);
  }, []);
  useEffect(widthUpdater, [conf.hide_side]);

  return (
    <>
      <Wrapper hideSide={conf.hide_side}>
        <Main useTop={conf.use_top && videos[0]}>
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
                  <Player video={video} />
                </PlayerItem>
              )
          )}
          {!videos[0] && <NoVideo addVideo={addVideo} />}
        </Main>
        <Sidebar />
      </Wrapper>
      <Footer addVideo={addVideo} />
    </>
  );
};

export default Index;
