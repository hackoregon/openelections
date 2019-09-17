import React from 'react';
import PropTypes from 'prop-types';

export default class ReadOnly extends React.Component {
  render() {
    const { ro = false, children } = this.props;
    return (
      <div style={ro ? { pointerEvents: 'none', opacity: '0.7' } : null}>
        {children}
      </div>
    );
  }
}

ReadOnly.propTypes = {
  ro: PropTypes.bool,
};
