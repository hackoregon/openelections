import React from 'react'
import { Link } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = css`
  border: 1px solid #ccc;
  display: inline-block;
  padding: 15px;
  border-radius: 5px;
  
  .role {
    margin: 0 0 20px 0;
    color: #666;
    text-transform: capitalize;
  }
  
  .name {
    margin-bottom: 0;
  }
  
  .email {
    margin-bottom: 20px;
  }
  
  
`;

const UserInfoBox = ({ role, name, email, isVerified }) => {

    return (
        <div css={styles}>
            <p className={'role'}>{role} { ( (!isVerified)? '(Pending)' : '' ) }</p>
            <h3 className={'name'}>{name}</h3>
            <h6 className={'email'}>{email}</h6>
            <Link className={'manage-user-link'} to='/manage-user/'>Manage User</Link>
        </div>
    );

};



export default UserInfoBox;
