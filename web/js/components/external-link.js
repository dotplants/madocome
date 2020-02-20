import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ExternalLink = ({ href, children, ...prop }) => (
  <a target="_blank" rel="noopener noreferrer" href={href} {...prop}>
    {children}
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default memo(ExternalLink);
