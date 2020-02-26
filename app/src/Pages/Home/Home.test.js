import React from 'react';
import { shallow } from 'enzyme';
import Home from './index';

describe('<Home/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
