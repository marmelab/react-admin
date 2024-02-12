import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { useGetOne } from './useGetOne';
import { testDataProvider } from '../dataProvider';
import { QueryClient } from '@tanstack/react-query';

const UseGetOne = ({
    resource,
    id,
    meta = undefined,
    options = {},
    callback = undefined,
}: {
    resource: string;
    id: string | number;
    meta?: object;
    options?: object;
    callback?: Function;
}) => {
    const hookValue = useGetOne(resource, { id, meta }, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetOne', () => {
    let dataProvider;

    beforeEach(() => {
        dataProvider = testDataProvider({
            getOne: jest
                .fn()
                .mockResolvedValue({ data: { id: 1, title: 'foo' } }),
        });
    });

    it('should call dataProvider.getOne() on mount', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: 1,
                signal: expect.anything(),
            });
        });
    });

    it('should not call dataProvider.getOne() on mount if enabled is false', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ enabled: false }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(0);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ enabled: true }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });

    it('should not call dataProvider.getOne() on update', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });

    it('should recall dataProvider.getOne() when id changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={2} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
        });
    });

    it('should recall dataProvider.getOne() when resource changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="comments" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} meta={{ hello: 'world' }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: 1,
                meta: { hello: 'world' },
                signal: expect.anything(),
            });
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const hookValue = jest.fn();
        const dataProvider = testDataProvider({
            getOne: jest.fn().mockRejectedValue(new Error('failed')),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    callback={hookValue}
                    options={{ retry: false }}
                />
            </CoreAdminContext>
        );
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                error: null,
            })
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(hookValue).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: new Error('failed'),
                })
            );
        });
    });

    it('should execute success side effects on success', async () => {
        const onSuccess = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} options={{ onSuccess }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(onSuccess).toHaveBeenCalledWith({ id: 1, title: 'foo' });
        });
    });

    it('should execute error side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = testDataProvider({
            getOne: jest.fn().mockRejectedValue(new Error('failed')),
        });
        const onError = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ onError, retry: false }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(new Error('failed'));
        });
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const dataProvider = testDataProvider({
            getOne: jest.fn(
                (_resource, { signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        });
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                dataProvider={dataProvider}
                queryClient={queryClient}
            >
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['posts', 'getOne', { id: '1' }],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
