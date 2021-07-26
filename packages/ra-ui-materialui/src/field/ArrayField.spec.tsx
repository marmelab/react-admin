import * as React from 'react';
import { render } from '@testing-library/react';
import { TestContext } from 'ra-test';

import ArrayField from './ArrayField';
import NumberField from './NumberField';
import TextField from './TextField';
import Datagrid from '../list/datagrid/Datagrid';

describe('<ArrayField />', () => {
    const currentSort = { field: 'id', order: 'ASC' };

    const DummyIterator = props => (
        <Datagrid {...props} currentSort={currentSort}>
            <NumberField source="id" />
            <TextField source="foo" />
        </Datagrid>
    );

    it('should not fail for empty records', () => {
        const { queryByText } = render(
            <TestContext>
                <ArrayField source="arr" resource="posts" record={{ id: 123 }}>
                    <DummyIterator />
                </ArrayField>
            </TestContext>
        );

        // Test the datagrid know about the fields
        expect(queryByText('resources.posts.fields.id')).not.toBeNull();
        expect(queryByText('resources.posts.fields.foo')).not.toBeNull();
    });

    it('should render the underlying iterator component', () => {
        const { queryByText } = render(
            <TestContext>
                <ArrayField
                    source="arr"
                    resource="posts"
                    record={{
                        id: 123,
                        arr: [
                            { id: 123, foo: 'bar' },
                            { id: 456, foo: 'baz' },
                        ],
                    }}
                >
                    <DummyIterator />
                </ArrayField>
            </TestContext>
        );

        // Test the datagrid know about the fields
        expect(queryByText('resources.posts.fields.id')).not.toBeNull();
        expect(queryByText('resources.posts.fields.foo')).not.toBeNull();

        // Test the fields values
        expect(queryByText('bar')).not.toBeNull();
        expect(queryByText('123')).not.toBeNull();

        expect(queryByText('baz')).not.toBeNull();
        expect(queryByText('456')).not.toBeNull();
    });
});
