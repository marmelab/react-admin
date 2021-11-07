import * as React from 'react';
import { render } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';
import { SimpleShowLayout } from './SimpleShowLayout';
import { TextField } from '../field';

describe('<SimpleShowLayout />', () => {
    it('should display children filelds', () => {
        const { queryByText } = render(
            <RecordContextProvider value={{ source1: 'foo', source2: 'bar' }}>
                <SimpleShowLayout>
                    <TextField source="source1" />
                    <TextField source="source2" />
                </SimpleShowLayout>
            </RecordContextProvider>
        );
        expect(queryByText('foo')).not.toBeNull();
        expect(queryByText('bar')).not.toBeNull();
    });
});
