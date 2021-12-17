import * as React from 'react';
import { useState, useCallback, ReactElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import omit from 'lodash/omit';
import expect from 'expect';
import { Provider } from 'react-redux';

import { useReferenceInputController } from './useReferenceInputController';
import { createAdminStore, CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';

const ReferenceInputController = props => {
    const { children, ...rest } = props;
    return children(useReferenceInputController(rest)) as ReactElement;
};

describe('useReferenceInputController', () => {
    const defaultProps = {
        basePath: '/comments',
        children: jest.fn(),
        input: { value: undefined } as any,
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    const dataProvider = testDataProvider({
        getMany: jest
            .fn()
            .mockResolvedValue({ data: [{ id: 1, title: 'foo' }] }),
        getList: jest.fn().mockResolvedValue({
            data: [
                { id: 1, title: 'foo' },
                { id: 2, title: 'bar' },
            ],
            total: 2,
        }),
    });

    afterEach(() => {
        // @ts-ignore
        dataProvider.getMany.mockClear();
        // @ts-ignore
        dataProvider.getList.mockClear();
    });

    it('should fetch possible values using getList', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceInputController {...defaultProps}>
                    {children}
                </ReferenceInputController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('posts', {
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
            });
        });
    });

    it('should allow getList pagination and sorting customization', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
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
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('posts', {
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
            });
        });
    });

    it('should fetch current value using getMany', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceInputController
                    {...{
                        ...defaultProps,
                        input: { value: 1 } as any,
                    }}
                >
                    {children}
                </ReferenceInputController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getMany).toBeCalledTimes(1);
            expect(dataProvider.getMany).toBeCalledWith('posts', { ids: [1] });
        });
    });

    it('should pass possibleValues and record to child', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
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
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    possibleValues: {
                        currentSort: {
                            field: 'title',
                            order: 'ASC',
                        },
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                        displayedFilters: [],
                        error: null,
                        filterValues: {
                            q: '',
                        },
                        isFetching: false,
                        isLoading: false,
                        page: 1,
                        perPage: 25,
                        hideFilter: expect.any(Function),
                        onSelect: expect.any(Function),
                        onToggleItem: expect.any(Function),
                        onUnselectItems: expect.any(Function),
                        setFilters: expect.any(Function),
                        setPage: expect.any(Function),
                        setPerPage: expect.any(Function),
                        setSort: expect.any(Function),
                        showFilter: expect.any(Function),
                        refetch: expect.any(Function),
                        resource: 'comments',
                        selectedIds: [],
                        total: 2,
                    },
                    referenceRecord: {
                        data: {
                            id: 1,
                            title: 'foo',
                        },
                        error: null,
                        isLoading: false,
                        isFetching: false,
                        refetch: expect.any(Function),
                    },
                    dataStatus: {
                        error: null,
                        loading: false,
                        warning: null,
                    },
                    choices: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    error: null,
                    filter: { q: '' },
                    isFetching: false,
                    isLoading: false,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'title', order: 'ASC' },
                    warning: null,
                })
            );
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
                            sort,
                        }}
                    >
                        {children}
                    </ReferenceInputController>
                </>
            );
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Component />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
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
            });
        });
        fireEvent.click(screen.getByLabelText('Change sort'));
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
            expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
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
            });
        });
    });

    describe('enableGetChoices', () => {
        it('should not fetch possible values using getList on load but only when enableGetChoices returns true', async () => {
            const children = jest.fn().mockReturnValue(<p>child</p>);
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return q.length > 2;
            });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ReferenceInputController
                        {...defaultProps}
                        enableGetChoices={enableGetChoices}
                    >
                        {children}
                    </ReferenceInputController>
                </CoreAdminContext>
            );

            // not call on start
            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(0);
                expect(enableGetChoices).toHaveBeenCalledWith({ q: '' });
            });

            const { setFilter } = children.mock.calls[0][0];
            setFilter('hello world');

            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(1);
                expect(enableGetChoices).toHaveBeenCalledWith({
                    q: 'hello world',
                });
            });
        });

        it('should fetch current value using getMany even if enableGetChoices is returning false', async () => {
            const children = jest.fn().mockReturnValue(<p>child</p>);
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ReferenceInputController
                        {...{
                            ...defaultProps,
                            input: { value: 1 } as any,
                            enableGetChoices: () => false,
                        }}
                    >
                        {children}
                    </ReferenceInputController>
                </CoreAdminContext>
            );

            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(0);
                expect(dataProvider.getMany).toBeCalledTimes(1);
            });
        });
    });
});
