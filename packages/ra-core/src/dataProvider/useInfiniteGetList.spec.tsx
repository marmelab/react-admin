import * as React from 'react';
import expect from 'expect';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { Basic, PageInfo } from './useInfiniteGetList.stories';

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

        render(<Basic dataProvider={dataProvider} resource="heroes" />);
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
        const { rerender } = render(<Basic dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<Basic dataProvider={dataProvider} />);
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
            <Basic dataProvider={dataProvider} resource="heroes" />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<Basic dataProvider={dataProvider} />);
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
            <Basic
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

    it('should call success side effects on success', async () => {
        const onSuccess1 = jest.fn();

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
            <Basic
                dataProvider={dataProvider}
                pagination={{ page: 1, perPage: 1 }}
                options={{ onSuccess: onSuccess1 }}
            />
        );
        await waitFor(async () => {
            expect(onSuccess1).toBeCalledTimes(1);
            expect(screen.getByLabelText('country').innerHTML).toContain(
                'France'
            );

            screen.getByLabelText('refetch-button').click();

            await waitFor(async () => {
                expect(onSuccess1).toBeCalledTimes(2);
                expect(screen.queryAllByLabelText('country')).toHaveLength(2);
            });
        });
    });

    describe('fetchNextPage', () => {
        it('should fetch the next page when the dataProvider uses total', async () => {
            render(<Basic />);
            const button = await screen.findByLabelText('refetch-button');
            fireEvent.click(button);
            await screen.findByText('Belgium -- BE');
        });
        it('should fetch the next page when the dataProvider uses pageInfo', async () => {
            render(<PageInfo />);
            const button = await screen.findByLabelText('refetch-button');
            fireEvent.click(button);
            await screen.findByText('Belgium -- BE');
        });
    });
});
