import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import Icon from './icon';

const StyledNoVideo = styled.div({
  textAlign: 'center',
  color: props => darken(0.45, props.theme.text)
});

const NoVideo = () => (
  <StyledNoVideo>
    YouTube の URL をクリップボードにコピーして、
    <br />
    <div style={{ fontSize: '2rem' }}>
      <b>
        <Icon icon="plus" />
        ボタン
      </b>
      で開始
    </div>
  </StyledNoVideo>
);

export default NoVideo;
