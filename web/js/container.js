import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { getConfig, setConfig } from './utils/config';

const insertTop = (element, newValue) => {
  const newElem = element.slice();
  newElem.unshift(newValue);
  return newElem;
};

const Container = () => {
  const [comments, setComments] = useState([]);
  const [videos, SetVideos] = useState(getConfig('videos') || []);

  useEffect(() => {
    if (comments.length > 300) {
      setComments(prev => {
        prev.length = 300;
        return prev;
      });
    }
  }, [comments]);

  const addComment = data => setComments(prev => insertTop(prev, data));
  const setVideos = func => {
    const newState = SetVideos(func);
    setConfig('videos', newState);
    return newState;
  };
  const setVideo = (videoId, data) =>
    setVideos(prev => {
      const index = prev.findIndex(({ id }) => id === videoId);
      if (index === -1) return prev;
      prev[index] = Object.assign(
        {},
        {
          ...prev[index],
          ...data
        }
      );
      return prev;
    });

  return {
    comments,
    setComments,
    videos,
    setVideos,
    setVideo,
    addComment
  };
};

export default createContainer(Container);
