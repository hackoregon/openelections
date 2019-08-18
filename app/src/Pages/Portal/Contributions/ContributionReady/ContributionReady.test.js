import React from 'react';
import { shallow } from 'enzyme';
import ContributionReady from './ContributionReady';

describe('<ContributionReady/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ContributionReady />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
