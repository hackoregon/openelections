import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';

describe('<AddUserForm/>', () => {
  it('should be defined', () => {
    expect(ResetPasswordForm).toMatchSnapshot();
  });
});
