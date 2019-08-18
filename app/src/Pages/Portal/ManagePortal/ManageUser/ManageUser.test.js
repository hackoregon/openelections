import React from 'react';
import { shallow } from 'enzyme';
import ManageUserPage from './ManageUser';

describe('<ManageUser/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(
      <ManageUserPage
        location={{
          state: {
            fname: 'test',
            lname: 'test',
            email: 'test',
          },
        }}
      />
    );
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
