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
    // .addDecorator((story: any) => <Provider story={story()} />)
    .add('Doohicky', () => <p>This is the Doohicky Section</p>)

Doohicky();
UserInfoBox();