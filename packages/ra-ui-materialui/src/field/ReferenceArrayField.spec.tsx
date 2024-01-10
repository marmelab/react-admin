import * as React from 'react';
import expect from 'expect';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
    ListContextProvider,
    CoreAdminContext,
    RecordContextProvider,
    useRecordContext,
    useListContext,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    ReferenceArrayField,
    ReferenceArrayFieldView,
} from './ReferenceArrayField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list';
import { AdminContext } from '../AdminContext';
import { DifferentIdTypes } from './ReferenceArrayField.stories';

const theme = createTheme({});

describe('<ReferenceArrayField />', () => {
    it('should render a loading indicator when related records are not yet fetched and a second has passed', async () => {
        const { queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        data: null,
                        isLoading: true,
                    }}
                >
                    <ReferenceArrayFieldView
                        source="barIds"
                        reference="bar"
                        record={{ id: 123, barIds: [1, 2] }}
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </ThemeProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));
        expect(queryAllByRole('progressbar')).toHaveLength(1);
    });

    it('should render a list of the child component', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{
                            resource: 'foo',
                            data,
                            isLoading: false,
                        }}
                    >
                        <ReferenceArrayFieldView
                            source="barIds"
                            record={{ id: 123, barIds: [1, 2] }}
                            reference="bar"
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole, container } = render(
            <ThemeProvider theme={theme}>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        data: [],
                        isLoading: false,
                    }}
                >
                    <ReferenceArrayFieldView
                        source="barIds"
                        record={{ id: 123, barIds: [1, 2] }}
                        reference="bar"
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </ThemeProvider>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).toBe('');
    });

    it('should support record with string identifier', () => {
        const data = [
            { id: 'abc-1', title: 'hello' },
            { id: 'abc-2', title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{
                            resource: 'foo',
                            data,
                            isLoading: false,
                        }}
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: ['abc-1', 'abc-2'] }}
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should support record with number identifier', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{
                            resource: 'foo',
                            data,
                            isLoading: false,
                        }}
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: [1, 2] }}
                            resource="foo"
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should use custom className', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { container } = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{
                            resource: 'foo',
                            data,
                            isLoading: false,
                        }}
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: [1, 2] }}
                            className="myClass"
                            resource="foo"
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('myClass')).toHaveLength(1);
    });

    it('should have defined data when loaded', async () => {
        let resolve;
        const promise = new Promise<any>(res => {
            resolve = res;
        });
        const WeakField = () => {
            const record = useRecordContext();
            return <div>{record?.title}</div>;
        };
        const dataProvider = {
            getMany: () =>
                promise.then(() => ({
                    data: [
                        { id: 1, title: 'bar1' },
                        { id: 2, title: 'bar2' },
                    ],
                })),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider as any}>
                <ThemeProvider theme={theme}>
                    <ReferenceArrayField
                        record={{ id: 123, barIds: [1, 2] }}
                        className="myClass"
                        resource="foos"
                        reference="bars"
                        source="barIds"
                    >
                        <SingleFieldList linkType={false}>
                            <WeakField />
                        </SingleFieldList>
                    </ReferenceArrayField>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryByText('bar1')).toBeNull();
        act(() => resolve());
        await waitFor(() => {
            expect(screen.queryByText('bar1')).not.toBeNull();
        });
    });

    it('should accept more than one child', async () => {
        const dataProvider = {
            getMany: () =>
                Promise.resolve({
                    data: [
                        { id: 4, title: 'programming' },
                        { id: 8, title: 'management' },
                        { id: 12, title: 'design' },
                    ],
                }),
        };
        const ListContextWatcher = () => {
            const { data } = useListContext();
            if (!data) return null;
            return (
                <ul>
                    {data.map(record => (
                        <li key={record.id}>tag:{record.title}</li>
                    ))}
                </ul>
            );
        };

        render(
            <AdminContext dataProvider={dataProvider}>
                <RecordContextProvider
                    value={{
                        id: 123,
                        title: 'hello, world',
                        tag_ids: [4, 8, 12],
                    }}
                >
                    <ReferenceArrayField source="tag_ids" reference="tags">
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                        <ListContextWatcher />
                    </ReferenceArrayField>
                </RecordContextProvider>
            </AdminContext>
        );
        await screen.findByText('programming');
        await screen.findByText('management');
        await screen.findByText('design');
        await screen.findByText('tag:programming');
        await screen.findByText('tag:management');
        await screen.findByText('tag:design');
    });

    it('should handle IDs of different types', async () => {
        render(<DifferentIdTypes />);

        expect(await screen.findByText('artist_1')).not.toBeNull();
        expect(await screen.findByText('artist_2')).not.toBeNull();
        expect(await screen.findByText('artist_3')).not.toBeNull();
    });
});
