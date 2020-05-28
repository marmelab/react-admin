import * as React from 'react';
import { render } from '@testing-library/react';

import SimpleShowLayout from './SimpleShowLayout';
import TextField from '../field/TextField';

describe('<SimpleShowLayout />', () => {
    it('should display children inputs of SimpleShowLayout', () => {
        const { queryByText } = render(
            <SimpleShowLayout record={{ foo: 'foo', bar: 'bar' }}>
                <TextField source="foo" />
                <TextField source="bar" />
            </SimpleShowLayout>
        );
        expect(queryByText('foo')).not.toBeNull();
        expect(queryByText('bar')).not.toBeNull();
    });
});
