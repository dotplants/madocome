import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';

import Icon from './icon';

const StyledNoVideo = styled.div({
  textAlign: 'center',
  color: props => darken(0.45, props.theme.text)
});

const AddButton = styled.b({
  cursor: 'pointer'
});

const NoVideo = props => {
  const { addVideo } = props;

  return (
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
};

NoVideo.propTypes = {
  addVideo: PropTypes.func.isRequired
};

export default NoVideo;
