import * as React from 'react';
import { render } from '@testing-library/react';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';

import { ArrayField } from './ArrayField';
import { NumberField } from './NumberField';
import { TextField } from './TextField';
import { Datagrid } from '../list';
import { SimpleList } from '../list';

describe('<ArrayField />', () => {
    const sort = { field: 'id', order: 'ASC' };

    const DummyIterator = props => (
        <Datagrid {...props} sort={sort}>
            <NumberField source="id" />
            <TextField source="foo" />
        </Datagrid>
    );

    const Wrapper = ({ children }) => (
        <ThemeProvider theme={createTheme()}>
            <CoreAdminContext dataProvider={testDataProvider()}>
                {children}
            </CoreAdminContext>
        </ThemeProvider>
    );

    it('should not fail for empty records', () => {
        render(
            <Wrapper>
                <ArrayField source="arr" resource="posts" record={{ id: 123 }}>
                    <DummyIterator />
                </ArrayField>
            </Wrapper>
        );
    });

    it('should render the alternative empty component', () => {
        const { queryByText } = render(
            <Wrapper>
                <ArrayField
                    source="arr"
                    resource="posts"
                    record={{
                        id: 123,
                        arr: [],
                    }}
                >
                    <Datagrid empty={<div>No posts</div>}>
                        <NumberField source="id" />
                    </Datagrid>
                </ArrayField>
            </Wrapper>
        );
        expect(queryByText('No posts')).not.toBeNull();
    });

    it('should render the <Datagrid> iterator component', () => {
        const { queryByText } = render(
            <Wrapper>
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
            </Wrapper>
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

    it('should render the <SimpleList> iterator component', () => {
        const { queryByText } = render(
            <Wrapper>
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
                    <SimpleList
                        primaryText={record => record.foo}
                        secondaryText={record => record.id}
                    />
                </ArrayField>
            </Wrapper>
        );

        // Test the fields values
        expect(queryByText('bar')).not.toBeNull();
        expect(queryByText('123')).not.toBeNull();

        expect(queryByText('baz')).not.toBeNull();
        expect(queryByText('456')).not.toBeNull();
    });
});
