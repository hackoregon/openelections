import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageHoc from '../../components/PageHoc/PageHoc';
import { getPublicData } from '../../state/ducks/publicData';

class HomePage extends React.Component {
  componentDidMount() {
    this.props.fetchPublicData();
  }

  render() {
    return (
      <PageHoc>
        <h1>Home</h1>
      </PageHoc>
    );
  }
}

HomePage.propTypes = {
  fetchPublicData: PropTypes.func, // eslint-disable-line
};

export default connect(
  state => ({}),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
    };
  }
)(HomePage);
