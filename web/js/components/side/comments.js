import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Alert from '../alert';
import ExternalLink from '../external-link';
import Comment from '../comment';
import { getConfig } from '../../utils/config';
import Container from '../../container';

const StyledComments = styled.div({
  gridRow: 2,
  gridColumn: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column-reverse'
});

const token = getConfig('access_token', 'live_token');

const Comments = ({ comments, onScroll, divRef }) => {
  const { conf } = Container.useContainer();

  return (
    <StyledComments onScroll={onScroll} ref={divRef}>
      {!token && (
        <Alert>
          <FormattedMessage
            id="components.side.please_login"
            values={{
              login: (
                <a href="/api/auth-login">
                  <FormattedMessage id="components.side.login" />
                </a>
              )
            }}
          />
          <br />
          <small>
            <FormattedMessage
              id="components.side.login_note.title"
              values={{
                terms: (
                  <ExternalLink href="https://www.youtube.com/t/terms">
                    <FormattedMessage id="components.side.login_note.terms" />
                  </ExternalLink>
                ),
                privacy: (
                  <ExternalLink href="https://policies.google.com/privacy">
                    <FormattedMessage id="components.side.login_note.privacy" />
                  </ExternalLink>
                ),
                document: (
                  <ExternalLink href="https://github.com/dotplants/madocome/blob/master/docs/ja/api-permission.md">
                    <FormattedMessage id="components.side.login_note.document" />
                  </ExternalLink>
                )
              }}
            />
          </small>
        </Alert>
      )}
      {token &&
        comments
          .map((comment, key) => (
            <Comment comment={comment} key={comment.id || key} conf={conf} />
          ))
          .filter((v, i) => i < 150)}
    </StyledComments>
  );
};

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  onScroll: PropTypes.func.isRequired,
  divRef: PropTypes.object
};

export default Comments;
