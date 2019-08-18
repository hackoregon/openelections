import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

describe('<Home/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
