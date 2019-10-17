import * as React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { ReactComponent as Logo } from '@hackoregon/component-library/assets/civic-logo-animated.svg';
import Routes from './Pages/routes';
import FlashMessage from './components/FlashMessage/FlashMessage';
import styles from './assets/styles/global.styles';
import { isLoggedIn, me } from './state/ducks/auth';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const { loadAuth } = this.props;
    loadAuth().then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Global styles={styles} />
        <FlashMessage />
        {isLoading ? (
          <Logo
            width={150}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : (
          <Routes />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
  }),
  dispatch => {
    return {
      loadAuth: () => dispatch(me()),
    };
  }
)(App);

App.propTypes = {
  loadAuth: PropTypes.func,
};
