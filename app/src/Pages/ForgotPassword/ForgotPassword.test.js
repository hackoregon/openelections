import React from 'react';
import { shallow } from 'enzyme';
import ForgotPassword from './ForgotPassword';

describe('<ForgotPassword/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ForgotPassword />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
