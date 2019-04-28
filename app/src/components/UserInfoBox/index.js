import React from 'react'
import { Link } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = css`
  border: 1px solid;
  display: inline-block;
  padding: 20px;
  
  .role {
    margin: 0;
    color: #888;
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
