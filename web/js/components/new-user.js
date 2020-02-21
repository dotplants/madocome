import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { FormattedMessage } from 'react-intl';
import ExternalLink from './external-link';

const Box = styled.div({
  textAlign: 'center',
  position: 'fixed',
  top: 0,
  left: '50%',
  width: '600px',
  maxWidth: '90%',
  transform: 'translateX(-50%)',
  marginTop: '15px',
  padding: '10px',
  background: ({ theme: { background } }) => lighten(0.2, background),
  boxShadow: ({ theme: { shadow } }) => shadow
});

const NewUser = () => (
  <Box>
    <h3>
      <FormattedMessage id="components.new_user.title" />
    </h3>
    <p>
      <FormattedMessage
        id="components.new_user.desc"
        values={{
          guide: (
            <ExternalLink href="https://github.com/dotplants/madocome/blob/master/docs/ja/getting-started.md">
              <FormattedMessage id="components.new_user.guide" />
            </ExternalLink>
          )
        }}
      />
    </p>
    <small>
      <FormattedMessage id="components.new_user.how_to_hide" />
    </small>
  </Box>
);

export default NewUser;
