import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Alert from './alert';

const StyledComment = styled.div({
  borderLeft: props => `solid 3px ${props.color}`,
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem'
});

const Comment = props => {
  const { comment, videos } = props;

  const getVideoIndex = videoId =>
    videos.findIndex(video => video.id === videoId);
  if (comment.video) {
    const video = videos[getVideoIndex(comment.video.id)];
    if (video && video.hideComment) {
      return;
    }
  }
  if (comment.isSystem) {
    const style = {};
    if (comment.video) {
      style.borderLeft = `solid 3px ${comment.video.color}`;
    }

    return <Alert style={style}>{comment.body}</Alert>;
  }

  if (comment.snippet.textMessageDetails) {
    return (
      <StyledComment color={comment.video.color}>
        {comment.snippet.textMessageDetails.messageText}
      </StyledComment>
    );
  }
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  videos: PropTypes.array.isRequired
};

export default Comment;
