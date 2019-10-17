import React from 'react';
import PropTypes from 'prop-types';
import { PageTransition } from '../PageTransistion';

const PageHoc = props => {
  const { children } = props;
  return <PageTransition>{children}</PageTransition>;
};
export default PageHoc;

PageHoc.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
};
