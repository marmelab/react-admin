import * as React from 'react';
import expect from 'expect';

import ReferenceArrayFieldController from './ReferenceArrayFieldController';
import { DataProviderContext } from '../../dataProvider';
import { renderWithRedux } from 'ra-test';
import { waitFor } from '@testing-library/react';

describe('<ReferenceArrayFieldController />', () => {
    it('should set the isLoading prop to true when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('child');

        renderWithRedux(
            <ReferenceArrayFieldController
                resource="foo"
                reference="bar"
                record={{ id: 1, barIds: [1, 2] }}
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {},
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toMatchObject({
            basePath: '/bar',
            currentSort: { field: 'id', order: 'ASC' },
            isFetching: true,
            isLoading: true,
            data: [undefined, undefined],
            error: null,
        });
    });

    it('should set the isLoading prop to true when at least one related record is not found', () => {
        const children = jest.fn().mockReturnValue('child');

        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                2: {
                                    id: 2,
                                    title: 'hello',
                                },
                            },
                        },
                    },
                },
            }
        );

        expect(children.mock.calls[0][0]).toMatchObject({
            basePath: '/bar',
            currentSort: { field: 'id', order: 'ASC' },
            isFetching: true,
            isLoading: true,
            data: [
                undefined,
                {
                    id: 2,
                    title: 'hello',
                },
            ],
            error: null,
        });
    });

    it('should set the data prop to the loaded data when it has been fetched', () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toMatchObject({
            basePath: '/bar',
            currentSort: { field: 'id', order: 'ASC' },
            isFetching: true,
            isLoading: false,
            data: [
                { id: 1, title: 'hello' },
                { id: 2, title: 'world' },
            ],
            error: null,
        });
    });

    it('should support record with string identifier', () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: ['abc-1', 'abc-2'] }}
                resource="foo"
                reference="bar"
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                'abc-1': { id: 'abc-1', title: 'hello' },
                                'abc-2': { id: 'abc-2', title: 'world' },
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toMatchObject({
            basePath: '/bar',
            currentSort: { field: 'id', order: 'ASC' },
            isFetching: true,
            isLoading: false,
            data: [
                { id: 'abc-1', title: 'hello' },
                { id: 'abc-2', title: 'world' },
            ],
            error: null,
        });
    });

    it('should call the dataProvider with GET_MANY on mount', async () => {
        const children = jest.fn().mockReturnValue('child');
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceArrayFieldController
                    record={{ id: 1, barIds: [1, 2] }}
                    resource="foo"
                    reference="bar"
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {},
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dispatch.mock.calls[0][0].type).toBe('RA/CRUD_GET_MANY');
            expect(dataProvider.getMany).toBeCalledTimes(1);
        });
    });

    it('should filter string data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                filter={{ title: 'world' }}
                resource="foo"
                reference="bar"
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    basePath: '/bar',
                    currentSort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [{ id: 2, title: 'world' }],
                    error: null,
                })
            );
        });
    });

    it('should filter array data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2, 3, 4] }}
                filter={{ items: ['two', 'four', 'five'] }}
                resource="foo"
                reference="bar"
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, items: ['one', 'two'] },
                                2: { id: 2, items: ['three'] },
                                3: { id: 3, items: 'four' },
                                4: { id: 4, items: ['five'] },
                            },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    basePath: '/bar',
                    currentSort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 1, items: ['one', 'two'] },
                        { id: 3, items: 'four' },
                        { id: 4, items: ['five'] },
                    ],
                    error: null,
                })
            );
        });
    });
});
