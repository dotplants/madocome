import { useState, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import { getConfig, setConfig } from './utils/config';
import { youtubeRegExp } from './utils/env';
import { selectOneColor } from './utils/colors';

const length = 6;

const Container = () => {
  const [Videos, SetVideos] = useState(getConfig('videos') || []);
  const [Conf, SetConf] = useState(JSON.stringify(getConfig('conf') || {}));
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const conf = JSON.parse(Conf);
  const videos = Videos.filter(v => v);

  const setVideos = func =>
    SetVideos(prev => {
      const next = func(prev);
      setConfig('videos', next);
      return next;
    });
  const setConf = (key, value) => {
    conf[key] = value;
    SetConf(JSON.stringify(conf));
    setConfig('conf', conf);
  };
  const setVideo = (videoId, data) =>
    setVideos(prev => {
      const index = prev.findIndex(({ id }) => id === videoId);
      if (index === -1) return prev;
      prev[index] = {
        ...prev[index],
        ...data
      };
      return prev;
    });

  const addVideo = formatMessage => {
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

        return prev;
      });
      forceUpdate();
    };

    if ('clipboard' in navigator && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(resolve);
    } else {
      const data = prompt(formatMessage({ id: 'pages.index.paste_url' }), '');
      resolve(data);
    }
  };

  return {
    videos,
    setVideos,
    setVideo,
    conf,
    setConf,
    forceUpdate,
    addVideo
  };
};

export default createContainer(Container);
