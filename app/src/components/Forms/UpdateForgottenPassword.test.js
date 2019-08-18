import React from 'react';
import { UpdateForgottenPasswordForm } from './UpdateForgottenPassword';

describe('<UpdateForgottenPasswordForm/>', () => {
  it('should be defined', () => {
    expect(UpdateForgottenPasswordForm).toMatchSnapshot();
  });
});
