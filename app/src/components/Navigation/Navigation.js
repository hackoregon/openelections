import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = props => {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/add-user">Add User</NavLink>
      <NavLink to="/change-password">Change password</NavLink>
      <NavLink to="/sign-in">Sign In</NavLink>
      <NavLink to="/forgot-password">Forgot Password</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/contributions">Contributions</NavLink>
    </nav>
  );
};

export default Navigation;
