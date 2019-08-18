import React from 'react';
import AddUserForm from './AddUserForm';

describe('<AddUserForm/>', () => {
  it('should be defined', () => {
    expect(AddUserForm).toMatchSnapshot();
  });
});
