import * as React from 'react';
import { ReactNode } from 'react';
import expect from 'expect';

import { useList, UseListOptions, UseListValue } from './useList';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ListContextProvider } from './ListContextProvider';
import { useListContext } from './useListContext';

const UseList = ({
    children,
    callback,
    ...props
}: UseListOptions & {
    children?: ReactNode;
    callback: (value: UseListValue) => void;
}) => {
    const value = useList(props);
    callback(value);
    return <ListContextProvider value={value}>{children}</ListContextProvider>;
};

describe('<useList />', () => {
    it('should filter string data based on the filter props', () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        render(
            <UseList
                data={data}
                filter={{ title: 'world' }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                currentSort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [{ id: 2, title: 'world' }],
                error: undefined,
                total: 1,
            })
        );
    });

    it('should filter array data based on the filter props', async () => {
        const callback = jest.fn();
        const data = [
            { id: 1, items: ['one', 'two'] },
            { id: 2, items: ['three'] },
            { id: 3, items: 'four' },
            { id: 4, items: ['five'] },
        ];

        render(
            <UseList
                data={data}
                filter={{ items: ['two', 'four', 'five'] }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 1, items: ['one', 'two'] },
                        { id: 3, items: 'four' },
                        { id: 4, items: ['five'] },
                    ],
                    error: undefined,
                    total: 3,
                })
            );
        });
    });

    it('should apply sorting correctly', async () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        const SortButton = () => {
            const listContext = useListContext();

            return (
                <button onClick={() => listContext.setSort('title', 'ASC')}>
                    Sort by title ASC
                </button>
            );
        };

        const { getByText } = render(
            <UseList
                data={data}
                sort={{ field: 'title', order: 'DESC' }}
                callback={callback}
            >
                <SortButton />
            </UseList>
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'title', order: 'DESC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 2, title: 'world' },
                        { id: 1, title: 'hello' },
                    ],
                    error: undefined,
                    total: 2,
                })
            );
        });

        fireEvent.click(getByText('Sort by title ASC'));
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'title', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    error: undefined,
                    total: 2,
                })
            );
        });
    });

    it('should apply pagination correctly', async () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
            { id: 3, title: 'baz' },
            { id: 4, title: 'bar' },
            { id: 5, title: 'foo' },
            { id: 6, title: 'plop' },
            { id: 7, title: 'bazinga' },
        ];

        render(
            <UseList
                data={data}
                sort={{ field: 'id', order: 'ASC' }}
                page={2}
                perPage={5}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 6, title: 'plop' },
                        { id: 7, title: 'bazinga' },
                    ],
                    page: 2,
                    perPage: 5,
                    error: undefined,
                    total: 7,
                })
            );
        });
    });

    it('should be usable with asynchronously fetched data', () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        const { rerender } = render(
            <UseList
                filter={{ title: 'world' }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        rerender(
            <UseList
                data={data}
                isFetching={true}
                isLoading={false}
                filter={{ title: 'world' }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                currentSort: { field: 'id', order: 'ASC' },
                isFetching: true,
                isLoading: false,
                data: [{ id: 2, title: 'world' }],
                error: undefined,
                total: 1,
            })
        );
    });
});
