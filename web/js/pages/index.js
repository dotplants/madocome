import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import Container from '../container';
import Footer from '../components/footer';
import Player from '../components/youtube-player';
import { selectOneColor } from '../utils/colors';
import { Main, Wrapper } from '../components/layout';
import NoVideo from '../components/no-video';
import Sidebar from '../components/side';
import { youtubeRegExp, setRatio } from '../utils/env';
import { getStringData, setConfig } from '../utils/config';
import NewUser from '../components/new-user';
import api from '../utils/api';

const length = 6;

const Index = () => {
  const { formatMessage } = useIntl();
  const { videos, setVideos, conf } = Container.useContainer();
  const [windowWidth, setWindowWidth] = useState(0);

  const checkName = () => {
    api({
      path: 'youtube/v3/channels',
      data: {
        part: 'snippet',
        maxResults: 1,
        mine: true
      }
    }).then(({ error, items }) => {
      if (error) {
        alert(JSON.stringify(error));
      }
      const data = items[0].snippet;
      console.log(data);
      setConfig('channel_name', data.title, 'live_token');
      setConfig('channel_avatar', data.thumbnails.medium.url, 'live_token');
    });
  };

  useEffect(() => {
    const onKeyDown = ({ keyCode, altKey }) => {
      // alt + V
      if (keyCode === 86 && altKey) {
        addVideo();
      }
    };

    getStringData('live_token') && checkName();
    window.addEventListener('keydown', onKeyDown, false);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const addVideo = () => {
    const resolve = data => {
      const obj = data.match(youtubeRegExp) || [];
      const id = obj[1];
      if (!id) {
        return alert(formatMessage({ id: 'pages.index.error_url' }));
      }
      setVideos(prev => {
        if (prev.find(video => video.id === id)) {
          alert(formatMessage({ id: 'pages.index.error_already' }));
          return prev;
        }
        if (prev.length >= length) {
          alert(formatMessage({ id: 'pages.index.error_length' }, { length }));
          return prev;
        }

        const newVideo = {
          id,
          color: selectOneColor()
        };
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
      const data = prompt(formatMessage({ id: 'pages.index.paste_url' }), '');
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
            v => v && <Player video={v} key={v.id} width={windowWidth} />
          )}
          {!videos[0] && <NoVideo addVideo={addVideo} />}
        </Main>
        <Sidebar />
      </Wrapper>
      <Footer addVideo={addVideo} />
      {!getStringData() && <NewUser />}
    </>
  );
};

export default Index;
