import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Alert from './alert';
import ExternalLink from './external-link';
import { darken } from 'polished';
import Icon from './icon';

const StyledComment = styled.div({
  borderLeft: props => `solid 3px ${props.color}`,
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  '': props =>
    props.hideLong
      ? {
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      : {}
});

const UserLink = styled(ExternalLink)({
  textDecoration: 'none',
  color: props => darken(0.15, props.theme.text)
});

const Avatar = styled.img({
  width: '1.3rem',
  height: '1.3rem',
  borderRadius: '100%',
  marginRight: '5px'
});

const UserName = styled.span({
  marginRight: '5px'
});

const AvatarBadge = styled(Icon)({
  marginRight: '5px',
  fontSize: '0.9rem',
  color: props => props.color || 'initial'
});

/*
const getUser = (userId, video) => new Promise((resolve, reject) => {
  fetch('', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(resolve);
    .catch(reject);
});
*/

const Comment = props => {
  const { comment, settings } = props;

  if (comment.isSystem) {
    const style = {};
    if (comment.video) {
      style.borderLeft = `solid 3px ${comment.video.color}`;
    }

    return <Alert style={style}>{comment.body}</Alert>;
  }

  const author = comment.authorDetails;
  /*
  const userId = comment.snippet.authorChannelId;
  const author = users[0][`${video.id}_${userId}`];
  if (!author && userId) {
    getUser(userId, video).then(user => users[1](prev => ({
      ...prev,
      [`${video.id}_${userId}`]: user
    }))); // setUsers
  }
  */
  if (comment.snippet.textMessageDetails) {
    return (
      <StyledComment
        color={comment.video.color}
        hideLong={settings.hide_longtext[0]}
      >
        {author && (
          <UserLink href={author.channelUrl}>
            <Avatar src={author.profileImageUrl} />
            {!settings.hide_username[0] && (
              <UserName>{author.displayName}</UserName>
            )}
            {author.isChatOwner && <AvatarBadge icon="crown" color="#ffc107" />}
            {author.isChatModerator && (
              <AvatarBadge icon="wrench" color="#036eec" />
            )}
            {author.isVerified && <AvatarBadge icon="check" />}
            {author.isChatSponsor && (
              <AvatarBadge icon="star" color="#28a745" />
            )}
          </UserLink>
        )}
        {comment.snippet.textMessageDetails.messageText}
      </StyledComment>
    );
  }
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

export default Comment;
