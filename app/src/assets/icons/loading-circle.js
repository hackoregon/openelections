// eslint-disable-next-line no-unused-vars
// TODO Consolidate spinners, are there multiple spinnetr components?
import React from 'react';
import PropTypes from 'prop-types';
import loader from '../styles/elementes/loader';

const LoadingCircle = ({ radius, color, className }) => (
  <div className={className} css={loader(radius || 20, color || '#000')}>
    Loading...
  </div>
);

export default LoadingCircle;

LoadingCircle.propTypes = {
  radius: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};
