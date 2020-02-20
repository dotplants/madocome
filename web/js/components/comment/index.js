import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';

import Alert from '../alert';
import ExternalLink from '../external-link';
import User from './user';

const tiers = [
  '',
  '#2655ff',
  '#259fff',
  '#46d070',
  '#ddb30a',
  '#ff8c39',
  '#ff5cce',
  '#ff3928',
  '#ff3928',
  '#ff3928',
  '#ff3928',
  '#ff3928'
];

const StyledComment = styled.div(({ color, hideLong, tier }) => ({
  borderLeft: `solid 3px ${color}`,
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  background: tier && tiers[tier],
  color: tier && '#fff',
  a: {
    color: tier && '#fff'
  },
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

const SuperChatComment = styled.div({
  marginTop: '5px'
});

const Comment = ({ comment, conf }) => {
  if (comment.isSystem) {
    const style = {};
    if (comment.video) {
      style.borderLeft = `solid 3px ${comment.video.color}`;
    }

    return <Alert style={style}>{comment.body}</Alert>;
  }

  const author = comment.authorDetails;

  if (comment.snippet.superChatDetails) {
    return (
      <StyledComment
        color={comment.video.color}
        tier={comment.snippet.superChatDetails.tier}
      >
        {author && (
          <UserLink href={author.channelUrl}>
            <Avatar src={author.profileImageUrl} />
            <User author={author} conf={conf} forceName />
            <b>{comment.snippet.superChatDetails.amountDisplayString}</b>
          </UserLink>
        )}
        <SuperChatComment>
          {comment.snippet.superChatDetails.userComment}
        </SuperChatComment>
      </StyledComment>
    );
  }

  if (comment.snippet.superStickerDetails) {
    console.log(comment.snippet.superStickerDetails);
  }

  if (comment.snippet.textMessageDetails) {
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
      return;
    }

    return (
      <StyledComment color={comment.video.color} hideLong={conf.hide_longtext}>
        {author && (
          <UserLink href={author.channelUrl}>
            <Avatar src={author.profileImageUrl} />
            <User author={author} conf={conf} />
          </UserLink>
        )}
        {comment.snippet.textMessageDetails.messageText}
      </StyledComment>
    );
  }
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  conf: PropTypes.object.isRequired
};

export default Comment;
