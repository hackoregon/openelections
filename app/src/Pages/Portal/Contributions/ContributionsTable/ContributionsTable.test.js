import React from 'react';
import { shallow } from 'enzyme';
import ContributionsTable from './ContributionsTable';

describe('<ContributionsTable/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ContributionsTable />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
