import * as React from 'react'
import { NavLink } from 'react-router-dom'
// import { connect } from 'react-redux';
// import { getCurrentState } from '../../state/test/selectors';
// import { testEmitter } from '../../state/test/actions';
const Navigation = (props: any) => {

  console.log(props.data);
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
    </nav>
    )
}

export default Navigation;
