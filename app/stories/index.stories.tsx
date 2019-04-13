import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
import Doohicky from '../src/components/Doohicky/index';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);


storiesOf('Doohicky', module)  
  .add('Doohicky', () => <Doohicky/>);