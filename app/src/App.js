import * as React from 'react';
import { Global, css } from '@emotion/core';
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
    this.props.loadAuth().then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <div>
        <Global styles={styles} />
        <FlashMessage />
        {this.state.isLoading ? (
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
