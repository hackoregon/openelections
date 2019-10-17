import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Fade } from '@material-ui/core';

function PageTransitionImage() {
  return (
    <div
      width={150}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </div>
  );
}

class PageTransition extends React.Component {
  render() {
    const { show = true, children } = this.props;
    return (
      <Fade in={show} timeout={{ enter: 1000, exit: 200 }}>
        <div>{children}</div>
      </Fade>
    );
  }
}

export { PageTransition, PageTransitionImage };

PageTransition.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.any]),
};
