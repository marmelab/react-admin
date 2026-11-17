import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    CoreAdminContext,
    ResourceContextProvider,
    testDataProvider,
    useListContext,
} from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';

import { ArrayField } from './ArrayField';
import { NumberField } from './NumberField';
import { TextField } from './TextField';
import { Datagrid, SimpleList } from '../list';
import { BulkActionButtons, ListContext } from './ArrayField.stories';

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

    it('should expose getData with the full list', async () => {
        const ListContextWatcher = () => {
            const { getData } = useListContext();
            const [count, setCount] = React.useState<number | null>(null);

            React.useEffect(() => {
                if (!getData) return;
                getData().then(records => setCount(records.length));
            }, [getData]);

            return count !== null ? <span>count:{count}</span> : null;
        };

        render(
            <Wrapper>
                <ArrayField
                    source="arr"
                    perPage={1}
                    record={{
                        id: 123,
                        arr: [
                            { id: 1, foo: 'bar' },
                            { id: 2, foo: 'baz' },
                        ],
                    }}
                >
                    <ListContextWatcher />
                </ArrayField>
            </Wrapper>
        );

        await screen.findByText('count:2');
    });

    it.each(['DataTable', 'Datagrid'] as const)(
        'should not show the default bulk actions in a %s',
        async iterator => {
            render(<BulkActionButtons iterator={iterator} />);
            await screen.findByText('http://example.com/foo/bar.html');
            expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
        }
    );

    it.each(['DataTable', 'Datagrid'] as const)(
        'should show the bulk actions passed to a %s',
        async iterator => {
            render(
                <BulkActionButtons
                    iterator={iterator}
                    bulkActionButtons="custom"
                />
            );
            await screen.findByText('http://example.com/foo/bar.html');
            expect(screen.getAllByRole('checkbox')).toHaveLength(3);
        }
    );

    it.each(['DataTable', 'Datagrid'] as const)(
        'should not fall back to the default bulk actions when a %s gets bulkActionButtons={true}',
        async iterator => {
            render(
                <BulkActionButtons
                    iterator={iterator}
                    bulkActionButtons="true"
                />
            );
            fireEvent.click((await screen.findAllByRole('checkbox'))[1]);
            await screen.findByText('ra.action.bulk_actions');
            expect(screen.queryByLabelText('ra.action.delete')).toBeNull();
        }
    );
});
