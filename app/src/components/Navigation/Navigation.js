import * as React from 'react'
import { NavLink } from 'react-router-dom'
// import { connect } from 'react-redux';
// import { getCurrentState } from '../../state/test/selectors';
// import { testEmitter } from '../../state/test/actions';
const Navigation = (props) => {

  console.log(props.data);
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/contributions">Contributions</NavLink>
    </nav>
    )
}

export default Navigation;
