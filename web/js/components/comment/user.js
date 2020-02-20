import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Icon from '../icon';

const UserName = styled.span({
  marginRight: '5px'
});

const AvatarBadge = styled(Icon)(({ color }) => ({
  marginRight: '5px',
  fontSize: '0.9rem',
  color: color || 'initial'
}));

const User = ({ conf, author, forceName }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      {(!conf.hide_username || forceName) && (
        <UserName>{author.displayName}</UserName>
      )}
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
          color="#ddd"
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
    </>
  );
};

User.propTypes = {
  author: PropTypes.object.isRequired,
  conf: PropTypes.object.isRequired,
  forceName: PropTypes.bool
};

export default memo(User);
