import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
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
    <FormattedMessage id="components.no-video.l1" />
    <div style={{ fontSize: '2rem' }}>
      <FormattedMessage
        id="components.no-video.l2"
        values={{
          button: (
            <AddButton onClick={addVideo}>
              <Icon icon="plus" />
              <FormattedMessage id="components.no-video.button" />
            </AddButton>
          )
        }}
      />
    </div>
  </StyledNoVideo>
);

NoVideo.propTypes = {
  addVideo: PropTypes.func.isRequired
};

export default memo(NoVideo);
