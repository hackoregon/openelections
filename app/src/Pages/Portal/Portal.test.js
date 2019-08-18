import React from 'react';
import { shallow } from 'enzyme';
import Portal from './Portal';

describe('<Portal/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Portal />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
