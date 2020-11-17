import * as React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import Logo from '@hackoregon/component-library/assets/civic-logo-animated.svg';
// import styles from '@hackoregon/component-library/assets/global.styles.css';
import Routes from './Pages/routes';
import FlashMessage from './components/FlashMessage/FlashMessage';
import styles from './assets/styles/global.styles';
import { isLoggedIn, me } from './state/ducks/auth';

const style = css`
  .logo-img {
    display: block;
    height: 60px;
  }
`;

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
      <div css={style}>
        <Global styles={styles} />
        <FlashMessage />
        {isLoading ? <img src={Logo} alt="Logo" /> : <Routes />}
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
