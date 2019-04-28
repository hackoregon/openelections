import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, optionsKnob as options, OptionsKnobOptions } from '@storybook/addon-knobs';
import SearchBox from '../src/components/SearchBox/SearchBox';


// const label = 'Role';
// const valuesObj = {
//     Admin: 'admin',
//     Staff: 'staff',
// };
// const defaultValue = data.role;
// const optionsObj = {
//     display: 'select'
// };

export default () => storiesOf('UI Components/Search Box', module)
    .addDecorator(withKnobs)
    .add('Simple Example',
        () => {

            return (<SearchBox
                        placeholder={'Search'}
                        onSearchQueryChange={action( 'onSearchQueryChange' )}
            />);
        }
    );
