import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { ArrayField } from './ArrayField';
import NumberField from './NumberField';
import TextField from './TextField';
import Datagrid from '../list/Datagrid';
import { TestContext } from 'ra-core';

describe('<ArrayField />', () => {
    afterEach(cleanup);

    const DummyIterator = props => (
        <Datagrid {...props}>
            <NumberField source="id" />
            <TextField source="foo" />
        </Datagrid>
    );

    it('should not fail for empty records', () => {
        const { queryByText } = render(
            <TestContext>
                <ArrayField source="arr" resource="posts" record={{}}>
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
                        arr: [{ id: 123, foo: 'bar' }, { id: 456, foo: 'baz' }],
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
