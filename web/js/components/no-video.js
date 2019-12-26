import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';

import Icon from './icon';

const StyledNoVideo = styled.div(({ theme }) => ({
  textAlign: 'center',
  color: darken(0.45, theme.text)
}));

const AddButton = styled.b({
  cursor: 'pointer'
});

const NoVideo = ({ addVideo }) => (
  <StyledNoVideo>
    YouTube の URL をクリップボードにコピーして、
    <div style={{ fontSize: '2rem' }}>
      <AddButton onClick={addVideo}>
        <Icon icon="plus" />
        ボタン
      </AddButton>
      で開始
    </div>
  </StyledNoVideo>
);

NoVideo.propTypes = {
  addVideo: PropTypes.func.isRequired
};

export default NoVideo;
