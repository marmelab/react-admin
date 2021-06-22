import * as React from 'react';
import expect from 'expect';

import { useList, UseListOptions, UseListValue } from './useList';
import { render, waitFor } from '@testing-library/react';

const UseList = ({
    callback,
    ...props
}: UseListOptions & { callback: (value: UseListValue) => void }) => {
    const value = useList(props);
    callback(value);
    return null;
};

describe('<useList />', () => {
    it('should filter string data based on the filter props', () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const ids = [1, 2];

        render(
            <UseList
                data={data}
                ids={ids}
                loaded
                loading
                filter={{ title: 'world' }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                currentSort: { field: 'id', order: 'ASC' },
                loaded: true,
                loading: true,
                data: {
                    2: { id: 2, title: 'world' },
                },
                ids: [2],
                error: undefined,
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
        const ids = [1, 2, 3, 4];

        render(
            <UseList
                data={data}
                ids={ids}
                loaded
                loading
                filter={{ items: ['two', 'four', 'five'] }}
                sort={{ field: 'id', order: 'ASC' }}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'id', order: 'ASC' },
                    loaded: true,
                    loading: true,
                    data: {
                        1: { id: 1, items: ['one', 'two'] },
                        3: { id: 3, items: 'four' },
                        4: { id: 4, items: ['five'] },
                    },
                    ids: [1, 3, 4],
                    error: undefined,
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
        const ids = [1, 2];

        render(
            <UseList
                data={data}
                ids={ids}
                loaded
                loading
                sort={{ field: 'title', order: 'DESC' }}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentSort: { field: 'title', order: 'DESC' },
                    loaded: true,
                    loading: true,
                    data: {
                        2: { id: 2, title: 'world' },
                        1: { id: 1, title: 'hello' },
                    },
                    ids: [2, 1],
                    error: undefined,
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
        const ids = [1, 2, 3, 4, 5, 6, 7];

        render(
            <UseList
                data={data}
                ids={ids}
                loaded
                loading
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
                    loaded: true,
                    loading: true,
                    data: {
                        6: { id: 6, title: 'plop' },
                        7: { id: 7, title: 'bazinga' },
                    },
                    ids: [6, 7],
                    page: 2,
                    perPage: 5,
                    error: undefined,
                })
            );
        });
    });
});
