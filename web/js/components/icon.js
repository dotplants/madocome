import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from '../utils/classnames';

const Span = styled.span({
  cursor: props => (props.hasClick ? 'pointer' : 'unset')
});

const Icon = props => {
  const { icon, className, onClick, ...prop } = props;

  const type = props.type || 's';

  return (
    <Span
      hasClick={!!onClick}
      className={classNames(`fa${type}`, `fa-${icon}`, 'fa-fw', className)}
      onClick={onClick}
      {...prop}
    />
  );
};

Icon.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Icon;
