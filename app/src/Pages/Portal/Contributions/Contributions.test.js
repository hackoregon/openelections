import React from 'react';
import { shallow } from 'enzyme';
import Contributions from './Contributions';

describe('<Contributions/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Contributions />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
