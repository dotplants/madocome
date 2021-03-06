import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Alert from '../alert';
import ExternalLink from '../external-link';
import Comment from '../comment';
import { getConfig } from '../../utils/config';
import Container from '../../container';
import Icon from '../icon';

const StyledComments = styled.div({
  gridRow: 2,
  gridColumn: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column-reverse'
});

const Comments = ({ comments, onScroll, divRef }) => {
  const { conf, videos } = Container.useContainer();
  const token = getConfig('access_token', 'live_token');

  return (
    <StyledComments onScroll={onScroll} ref={divRef}>
      {token &&
        comments
          .map((comment, key) => {
            if (comment?.snippet?.textMessageDetails) {
              const author = comment?.authorDetails;
              if (
                (author.isChatOwner && conf.hide_owner) ||
                (author.isChatModerator && conf.hide_mod) ||
                (author.isVerified && conf.hide_verified) ||
                (author.isChatSponsor && conf.hide_sponsor) ||
                (conf.hide_anonymous &&
                  !author.isChatOwner &&
                  !author.isChatModerator &&
                  !author.isVerified &&
                  !author.isChatSponsor)
              ) {
                return null;
              }
            }

            return (
              <Comment comment={comment} key={comment.id || key} conf={conf} />
            );
          })
          .filter(v => v)
          .filter((v, i) => i < 200)}
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
                  <ExternalLink href="https://github.com/dotplants/madocome/blob/master/docs/ja/privacy-policy.md">
                    <FormattedMessage id="components.side.login_note.document" />
                  </ExternalLink>
                )
              }}
            />
          </small>
        </Alert>
      )}
      {!videos[0] && (
        <Alert>
          <b>
            <FormattedMessage id="components.side.introduction.title" />
          </b>
          <br />
          <FormattedMessage
            id="components.side.introduction.body"
            values={{
              add: (
                <b>
                  <Icon icon="plus" />
                  {` `}
                  <FormattedMessage id="components.side.introduction.add" />
                </b>
              )
            }}
          />
        </Alert>
      )}
    </StyledComments>
  );
};

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  onScroll: PropTypes.func.isRequired,
  divRef: PropTypes.object
};

export default Comments;
