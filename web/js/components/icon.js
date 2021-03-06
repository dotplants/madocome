import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from '../utils/classnames';

const Span = styled.span({
  cursor: ({ hasClick }) => (hasClick ? 'pointer' : 'unset')
});

const Icon = ({ type = 's', icon, className, onClick, ...prop }) => (
  <Span
    hasClick={!!onClick}
    className={classNames(`fa${type}`, `fa-${icon}`, 'fa-fw', className)}
    onClick={onClick}
    {...prop}
  />
);

Icon.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default memo(Icon);
