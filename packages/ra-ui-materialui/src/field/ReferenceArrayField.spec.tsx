import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListContextProvider } from 'ra-core';

import { ReferenceArrayFieldView } from './ReferenceArrayField';
import TextField from './TextField';
import SingleFieldList from '../list/SingleFieldList';

describe('<ReferenceArrayField />', () => {
    afterEach(cleanup);
    it('should render a loading indicator when related records are not yet fetched and a second has passed', async () => {
        const { queryAllByRole } = render(
            <ListContextProvider
                value={{
                    resource: 'foo',
                    basePath: '',
                    data: null,
                    ids: [1, 2],
                    loaded: false,
                    loading: true,
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
        );

        await new Promise(resolve => setTimeout(resolve, 1001));
        expect(queryAllByRole('progressbar')).toHaveLength(1);
    });

    it('should render a list of the child component', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
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
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole, container } = render(
            <ListContextProvider
                value={{
                    resource: 'foo',
                    basePath: '',
                    data: {},
                    ids: [],
                    loaded: true,
                    loading: false,
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
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).toBe('');
    });

    it('should support record with string identifier', () => {
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: ['abc-1', 'abc-2'],
                        loaded: true,
                        loading: false,
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
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should support record with number identifier', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
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
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should use custom className', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { container } = render(
            <MemoryRouter>
                <ListContextProvider
                    value={{
                        resource: 'foo',
                        basePath: '',
                        data,
                        ids: [1, 2],
                        loaded: true,
                        loading: false,
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
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('myClass')).toHaveLength(1);
    });
});
