import * as React from 'react';
import expect from 'expect';
import { screen, render, waitFor } from '@testing-library/react';
import { UseInfiniteListCore } from './useInfiniteGetList.stories';

describe('useInfiniteGetList', () => {
    it('should call dataProvider.getList() on mount', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;

        render(
            <UseInfiniteListCore
                dataProvider={dataProvider}
                resource="heroes"
            />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('heroes', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
            });
        });
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(
            <UseInfiniteListCore dataProvider={dataProvider} />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<UseInfiniteListCore dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(
            <UseInfiniteListCore
                dataProvider={dataProvider}
                resource="heroes"
            />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<UseInfiniteListCore dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        render(
            <UseInfiniteListCore
                dataProvider={dataProvider}
                pagination={{ page: 1, perPage: 20 }}
                meta={{ hello: 'world' }}
                resource="heroes"
            />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledWith('heroes', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
                meta: { hello: 'world' },
            });
        });
    });

    it('should execute success side effects on success', async () => {
        const countries = [
            { id: 73, name: 'France', code: 'FR' },
            { id: 74, name: 'Italia', code: 'IT' },
        ];
        const dataProvider = {
            getList: (resource, params) => {
                return Promise.resolve({
                    data: countries.slice(
                        (params.pagination.page - 1) *
                            params.pagination.perPage,
                        (params.pagination.page - 1) *
                            params.pagination.perPage +
                            params.pagination.perPage
                    ),
                    total: countries.length,
                });
            },
        };

        render(
            <UseInfiniteListCore
                dataProvider={dataProvider}
                pagination={{ page: 1, perPage: 1 }}
            />
        );
        await waitFor(async () => {
            expect(screen.getByLabelText('country').innerHTML).toContain(
                'France'
            );
            screen.getByLabelText('refetch-button').click();
            await waitFor(async () => {
                expect(screen.queryAllByLabelText('country')).toHaveLength(2);
            });
        });
    });
});
