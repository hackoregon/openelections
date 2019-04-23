import * as React from 'react'
import { Link } from 'react-router-dom';

const UserInfoBox = ({ role, name, email, isVerified }) => {
  if (! isVerified) {
      return (
          <div>
              <h6>{email}</h6>
              <p>Pending Initiation</p>
              <Link to='/manage-user/'>Resend Initiation</Link>
          </div>
      );
  } else {
    return (
        <div>
            <p>{role}</p>
            <h3>{name}</h3>
            <h6>{email}</h6>
            <Link to='/manage-user/'>Manage User</Link>
        </div>
    );
  }
};



export default UserInfoBox;
