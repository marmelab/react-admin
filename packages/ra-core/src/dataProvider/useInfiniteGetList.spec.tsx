import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { QueryClient } from 'react-query';
import { UseInfiniteComponent } from './useInfiniteGetList.stories';
import { CoreAdminContext } from '../core';

describe('useInfiniteGetList', () => {
    it('should call dataProvider.getList() on mount', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'Bruce' }],
                    total: 1,
                })
            ),
        } as any;

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('posts', {
                filter: {},
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'id', order: 'DESC' },
            });
        });
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'Bruce' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'Bruce' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent resource="comments" />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'Bruce' }],
                    total: 1,
                })
            ),
        } as any;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent
                    pagination={{ page: 1, perPage: 20 }}
                    meta={{ hello: 'world' }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledWith('posts', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
                meta: { hello: 'world' },
            });
        });
    });

    it('should execute success side effects on success', async () => {
        const onSuccess = jest.fn();
        const dataProvider = {
            getList: jest
                .fn()
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [{ id: 1, title: 'Bruce' }],
                        total: 2,
                    })
                )
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [{ id: 3, foo: 'Wayne' }],
                        total: 2,
                    })
                ),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseInfiniteComponent options={{ onSuccess }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(onSuccess).toBeCalledTimes(1);
            expect(onSuccess.mock.calls.pop()[0]).toEqual({
                data: [{ id: 1, title: 'Bruce' }],
                total: 2,
            });
        });
    });
});
