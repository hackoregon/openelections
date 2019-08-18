import React from 'react';
import { shallow } from 'enzyme';
import SignUp from './SignUp';

describe('<SignUp/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<SignUp />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
