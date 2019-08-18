import React from 'react';
import PasswordField from './PasswordField';

describe('<PasswordField/>', () => {
  it('should be defined', () => {
    expect(PasswordField).toMatchSnapshot();
  });
});
