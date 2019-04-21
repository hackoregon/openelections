import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
// import Doohicky from '../src/components/Doohicky/index';
// import Provider from './Provider';
import Doohicky from './doohicky.stories';
import UserInfoBox from './UserInfoBox.stories';
// import Provider from './Provider';


storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);


storiesOf('Doohicky', module)
    .add('Intro', () => <p>This is the Doohicky Section</p>);

Doohicky();

storiesOf('Portal', module)
    .add('Intro', () => <p>These are components used within the Dashboard</p>);

// Manage Portal
UserInfoBox();