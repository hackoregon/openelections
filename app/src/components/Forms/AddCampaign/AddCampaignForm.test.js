// eslint-disable-next-line no-unused-vars
import React from 'react';
import AddCampaignForm from './AddCampaignForm';

describe('<AddCampaignForm/>', () => {
  it('should be defined', () => {
    expect(AddCampaignForm).toMatchSnapshot();
  });
});
