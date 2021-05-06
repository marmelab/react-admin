import * as React from 'react';
import { useState, useCallback } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import omit from 'lodash/omit';
import expect from 'expect';

import { renderWithRedux } from 'ra-test';
import ReferenceInputController from './ReferenceInputController';
import { DataProviderContext } from '../../dataProvider';

describe('<ReferenceInputController />', () => {
    const defaultProps = {
        basePath: '/comments',
        children: jest.fn(),
        input: { value: undefined } as any,
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    const dataProvider = {
        getMany: jest.fn(() =>
            Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
        ),
        getList: jest.fn(() =>
            Promise.resolve({
                data: [
                    { id: 1, title: 'foo' },
                    { id: 2, title: 'bar' },
                ],
                total: 2,
            })
        ),
    };

    it('should fetch possible values using getList', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceInputController {...defaultProps}>
                    {children}
                </ReferenceInputController>
            </DataProviderContext.Provider>
        );

        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dispatch.mock.calls[0][0]).toEqual({
                type: 'CUSTOM_QUERY',
                payload: {
                    filter: {
                        q: '',
                    },
                    pagination: {
                        page: 1,
                        perPage: 25,
                    },
                    sort: {
                        field: 'id',
                        order: 'DESC',
                    },
                },
                meta: { resource: 'posts' },
            });
        });
    });

    it('should allow getList pagination and sorting customization', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceInputController
                    {...{
                        ...defaultProps,
                        page: 5,
                        perPage: 10,
                        sort: { field: 'title', order: 'ASC' },
                    }}
                >
                    {children}
                </ReferenceInputController>
            </DataProviderContext.Provider>
        );

        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dispatch.mock.calls[0][0]).toEqual({
                type: 'CUSTOM_QUERY',
                payload: {
                    filter: {
                        q: '',
                    },
                    pagination: {
                        page: 5,
                        perPage: 10,
                    },
                    sort: {
                        field: 'title',
                        order: 'ASC',
                    },
                },
                meta: { resource: 'posts' },
            });
        });
    });

    it('should fetch current value using getMany', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceInputController
                    {...{
                        ...defaultProps,
                        input: { value: 1 } as any,
                    }}
                >
                    {children}
                </ReferenceInputController>
            </DataProviderContext.Provider>
        );

        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(10); // 5 for getList, 5 for getMany
            expect(dispatch.mock.calls[5][0]).toEqual({
                type: 'RA/CRUD_GET_MANY',
                payload: { ids: [1] },
                meta: { resource: 'posts' },
            });
        });
    });

    it('should pass possibleValues and record to child', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceInputController
                    {...{
                        ...defaultProps,
                        input: { value: 1 } as any,
                        loading: true,
                        sort: { field: 'title', order: 'ASC' },
                    }}
                >
                    {children}
                </ReferenceInputController>
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: { posts: { data: { 1: { id: 1 } } } },
                },
            }
        );

        await waitFor(() => {
            expect(
                omit(children.mock.calls[0][0], [
                    'onChange',
                    'setPagination',
                    'setFilter',
                    'setSort',
                    'possibleValues.hideFilter',
                    'possibleValues.onSelect',
                    'possibleValues.onToggleItem',
                    'possibleValues.onUnselectItems',
                    'possibleValues.setFilters',
                    'possibleValues.setPage',
                    'possibleValues.setPerPage',
                    'possibleValues.setSort',
                    'possibleValues.showFilter',
                ])
            ).toEqual({
                refetch: expect.any(Function),
                possibleValues: {
                    basePath: '/comments',
                    currentSort: {
                        field: 'title',
                        order: 'ASC',
                    },
                    data: {
                        '1': {
                            id: 1,
                        },
                    },
                    displayedFilters: [],
                    error: null,
                    filterValues: {
                        q: '',
                    },
                    hasCreate: false,

                    ids: [1],
                    loaded: false,
                    loading: true,
                    page: 1,
                    perPage: 25,
                    refetch: expect.any(Function),
                    resource: 'comments',
                    selectedIds: [],

                    total: NaN,
                },
                referenceRecord: {
                    data: {
                        id: 1,
                    },
                    error: null,
                    loaded: true,
                    loading: true,
                    refetch: expect.any(Function),
                },
                dataStatus: {
                    error: null,
                    loading: false,
                    warning: null,
                },
                choices: [{ id: 1 }],
                error: null,
                filter: { q: '' },
                loaded: false,
                loading: true,
                pagination: { page: 1, perPage: 25 },
                sort: { field: 'title', order: 'ASC' },
                warning: null,
            });
        });
    });

    it('should refetch reference getList when its props change', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const Component = () => {
            const [sort, setSort] = useState({ field: 'title', order: 'ASC' });
            const handleClick = useCallback(
                () => setSort({ field: 'body', order: 'DESC' }),
                [setSort]
            );
            return (
                <>
                    <button aria-label="Change sort" onClick={handleClick} />
                    <ReferenceInputController
                        {...{
                            ...defaultProps,
                            loading: true,
                            sort,
                        }}
                    >
                        {children}
                    </ReferenceInputController>
                </>
            );
        };
        const { getByLabelText, dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Component />
            </DataProviderContext.Provider>
        );

        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dispatch.mock.calls[0][0]).toEqual({
                type: 'CUSTOM_QUERY',
                payload: {
                    filter: {
                        q: '',
                    },
                    pagination: {
                        page: 1,
                        perPage: 25,
                    },
                    sort: {
                        field: 'title',
                        order: 'ASC',
                    },
                },
                meta: { resource: 'posts' },
            });
        });
        fireEvent.click(getByLabelText('Change sort'));
        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(10);
            expect(dispatch.mock.calls[5][0]).toEqual({
                type: 'CUSTOM_QUERY',
                payload: {
                    filter: {
                        q: '',
                    },
                    pagination: {
                        page: 1,
                        perPage: 25,
                    },
                    sort: {
                        field: 'body',
                        order: 'DESC',
                    },
                },
                meta: { resource: 'posts' },
            });
        });
    });
});
