import * as React from 'react';
import expect from 'expect';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
    ListContextProvider,
    CoreAdminContext,
    useRecordContext,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    ReferenceArrayField,
    ReferenceArrayFieldView,
} from './ReferenceArrayField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list';

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
        expect(container.firstChild.textContent).not.toBeUndefined();
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
        expect(container.firstChild.textContent).toBe('');
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
        expect(container.firstChild.textContent).not.toBeUndefined();
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
});
