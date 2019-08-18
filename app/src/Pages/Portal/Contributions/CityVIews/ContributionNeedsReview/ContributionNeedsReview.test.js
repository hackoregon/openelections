import React from 'react';
import { shallow } from 'enzyme';
import ContributionNeedsReview from './ContributionNeedsReview';

describe('<ContributionNeedsReview/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ContributionNeedsReview />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
