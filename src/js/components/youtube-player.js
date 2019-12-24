import React from 'react';
import PropTypes from 'prop-types';

const Player = props => {
  const { id, ...prop } = props;
  const src = `https://www.youtube.com/embed/${id}`;

  return <iframe src={src} {...prop} />;
};

Player.propTypes = {
  id: PropTypes.string.isRequired
};

export default Player;
