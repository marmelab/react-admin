import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
    CoreAdminContext,
    ResourceContextProvider,
    testDataProvider,
} from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';

import { ArrayField } from './ArrayField';
import { NumberField } from './NumberField';
import { TextField } from './TextField';
import { Datagrid } from '../list';
import { SimpleList } from '../list';
import { ListContext, TwoArrayFieldsSelection } from './ArrayField.stories';

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
                <ResourceContextProvider value="posts">
                    {children}
                </ResourceContextProvider>
            </CoreAdminContext>
        </ThemeProvider>
    );

    it('should not fail for empty records', () => {
        render(
            <Wrapper>
                <ArrayField
                    // @ts-expect-error source prop does not have a valid value
                    source="arr"
                    record={{ id: 123 }}
                >
                    <DummyIterator />
                </ArrayField>
            </Wrapper>
        );
    });

    it('should not fail when value is null', () => {
        render(
            <Wrapper>
                <ArrayField source="arr" record={{ id: 123, arr: null }}>
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

    it('should create a ListContext with working callbacks', async () => {
        render(<ListContext />);
        screen.getByText('War and Peace');
        screen.getByText('Filter by title').click();
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).toBeNull();
        });
        const chip = screen.getByText('Resurrection');
        expect(
            (chip.parentNode as HTMLElement).className.includes(
                'MuiChip-colorDefault'
            )
        ).toBeTruthy();
        chip.click();
        await waitFor(() => {
            expect(
                (chip.parentNode as HTMLElement).className.includes(
                    'MuiChip-colorPrimary'
                )
            ).toBeTruthy();
        });
    });

    it('should not select the same id in both ArrayFields when selected in one', async () => {
        render(<TwoArrayFieldsSelection />);

        await waitFor(() => {
            expect(screen.queryAllByRole('checkbox').length).toBeGreaterThan(2);
        });

        const checkboxes = screen.queryAllByRole('checkbox');

        expect(checkboxes.length).toBeGreaterThan(3);

        // Select an item in the memberships list
        fireEvent.click(checkboxes[1]); // Membership row 1
        render(<TwoArrayFieldsSelection />);

        await waitFor(() => {
            expect(checkboxes[1]).toBeChecked();
        });

        //Ensure the same id in portfolios is NOT selected
        expect(checkboxes[3]).not.toBeChecked();

        fireEvent.click(checkboxes[3]);
        render(<TwoArrayFieldsSelection />);

        await waitFor(() => {
            expect(checkboxes[3]).toBeChecked();
            expect(checkboxes[1]).toBeChecked();
        });

        fireEvent.click(checkboxes[1]);
        render(<TwoArrayFieldsSelection />);

        await waitFor(() => {
            expect(checkboxes[1]).not.toBeChecked();
            expect(checkboxes[3]).toBeChecked();
        });
    });
});
