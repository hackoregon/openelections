import React from 'react';
import { shallow } from 'enzyme';
import About from './About';

describe('<About/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<About />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
