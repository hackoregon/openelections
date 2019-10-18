import React from 'react'; // eslint-disable-line no-unused-vars
import PasswordField from './PasswordField';

describe('<PasswordField/>', () => {
  it('should be defined', () => {
    expect(PasswordField).toMatchSnapshot();
  });
});
