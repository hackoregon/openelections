import React from 'react';
import { shallow } from 'enzyme';
import Sandbox from './Sandbox';

describe('<Sandbox/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Sandbox />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
