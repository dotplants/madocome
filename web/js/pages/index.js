import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import Container from '../container';
import { Wrapper } from '../components/layout';
import Sidebar from '../components/side';

const Index = () => {
  const { formatMessage } = useIntl();
  const { addVideo } = Container.useContainer();

  useEffect(() => {
    const onKeyDown = ({ keyCode, altKey }) => {
      // alt + V
      if (keyCode === 86 && altKey) {
        addVideo(formatMessage);
      }
    };

    window.addEventListener('keydown', onKeyDown, false);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Wrapper>
      <Sidebar />
    </Wrapper>
  );
};

export default Index;
