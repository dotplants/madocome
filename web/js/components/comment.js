import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Alert from './alert';
import ExternalLink from './external-link';
import { darken } from 'polished';
import Icon from './icon';
import Container from '../container';

const StyledComment = styled.div(({ color, hideLong }) => ({
  borderLeft: `solid 3px ${color}`,
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  '': hideLong
    ? {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    : {}
}));

const UserLink = styled(ExternalLink)(({ theme }) => ({
  textDecoration: 'none',
  color: darken(0.15, theme.text)
}));

const Avatar = styled.img({
  width: '1.3rem',
  height: '1.3rem',
  borderRadius: '100%',
  marginRight: '5px'
});

const UserName = styled.span({
  marginRight: '5px'
});

const AvatarBadge = styled(Icon)(({ color }) => ({
  marginRight: '5px',
  fontSize: '0.9rem',
  color: color || 'initial'
}));

const Comment = ({ comment }) => {
  const { formatMessage } = useIntl();
  const { conf } = Container.useContainer();

  if (comment.isSystem) {
    const style = {};
    if (comment.video) {
      style.borderLeft = `solid 3px ${comment.video.color}`;
    }

    return <Alert style={style}>{comment.body}</Alert>;
  }

  const author = comment.authorDetails;
  if (comment.snippet.textMessageDetails) {
    return (
      <StyledComment color={comment.video.color} hideLong={conf.hide_longtext}>
        {author && (
          <UserLink href={author.channelUrl}>
            <Avatar src={author.profileImageUrl} />
            {!conf.hide_username && <UserName>{author.displayName}</UserName>}
            {author.isChatOwner && (
              <AvatarBadge
                icon="crown"
                color="#ffc107"
                title={formatMessage({ id: 'components.comment.owner' })}
              />
            )}
            {author.isChatModerator && (
              <AvatarBadge
                icon="wrench"
                color="#036eec"
                title={formatMessage({ id: 'components.comment.mod' })}
              />
            )}
            {author.isVerified && (
              <AvatarBadge
                icon="check"
                title={formatMessage({ id: 'components.comment.verified' })}
              />
            )}
            {author.isChatSponsor && (
              <AvatarBadge
                icon="star"
                color="#28a745"
                title={formatMessage({ id: 'components.comment.sponsor' })}
              />
            )}
          </UserLink>
        )}
        {comment.snippet.textMessageDetails.messageText}
      </StyledComment>
    );
  }
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

export default Comment;
