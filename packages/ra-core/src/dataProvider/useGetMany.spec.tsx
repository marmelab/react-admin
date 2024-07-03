import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useGetMany } from './useGetMany';
import { useGetOne } from './useGetOne';
import { testDataProvider } from '../dataProvider';

const UseGetMany = ({
    resource,
    ids,
    meta = undefined,
    options = {},
    callback = undefined,
}: {
    resource: string;
    ids: any[];
    meta?: any;
    options?: any;
    callback?: Function;
}) => {
    const hookValue = useGetMany(resource, { ids, meta }, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

let updateState;

const UseCustomGetMany = ({
    resource,
    ids,
    options = {},
    callback = undefined,
}: {
    resource: string;
    ids: any[];
    options?: any;
    callback?: Function;
}) => {
    const [stateIds, setStateIds] = React.useState(ids);
    const hookValue = useGetMany(resource, { ids: stateIds }, options);
    if (callback) callback(hookValue);

    updateState = newIds => {
        setStateIds(newIds);
    };

    return <div>hello</div>;
};

describe('useGetMany', () => {
    let dataProvider;

    beforeEach(() => {
        dataProvider = testDataProvider({
            getMany: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 1, title: 'foo' }] }),
        });
    });

    it('should call dataProvider.getMany() on mount', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1],
                signal: undefined,
            });
        });
    });

    it('should not call dataProvider.getMany() on mount if enabled is false', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ enabled: false }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(0);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ enabled: true }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
    });

    it('should not call dataProvider.getMany() on update', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
    });

    it('should recall dataProvider.getMany() when ids changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1, 2]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('should recall dataProvider.getMany() when resource changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="comments" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    meta={{ hello: 'world' }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1],
                meta: { hello: 'world' },
                signal: undefined,
            });
        });
    });

    it('should use data from query cache on mount', async () => {
        const FecthGetMany = () => {
            useGetMany('posts', { ids: ['1'] });
            return <span>dummy</span>;
        };
        const hookValue = jest.fn();
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <FecthGetMany />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} callback={hookValue} />
            </CoreAdminContext>
        );
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [{ id: 1, title: 'foo' }],
                isFetching: true,
                isLoading: false,
                error: null,
            })
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(hookValue).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [{ id: 1, title: 'foo' }],
                    isFetching: false,
                    isLoading: false,
                    error: null,
                })
            );
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const hookValue = jest.fn();
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockRejectedValue(new Error('failed')),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} callback={hookValue} />
            </CoreAdminContext>
        );
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                error: null,
            })
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
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
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ onSuccess }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(onSuccess).toHaveBeenCalledWith([{ id: 1, title: 'foo' }]);
        });
    });

    it('should execute error side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockRejectedValue(new Error('failed')),
        });
        const onError = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} options={{ onError }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(new Error('failed'));
        });
    });

    it('should update loading state when ids change', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getMany: jest.fn((resource, params) => {
                if (params.ids.length === 1) {
                    return Promise.resolve({
                        data: [{ id: 1, title: 'foo' }],
                    });
                } else {
                    return Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                    });
                }
            }),
        });

        const hookValue = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseCustomGetMany
                    resource="posts"
                    ids={[1]}
                    callback={hookValue}
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getMany).toBeCalledTimes(1);
        });

        expect(hookValue.mock.calls[0][0]).toStrictEqual(
            expect.objectContaining({
                data: undefined,
                isError: false,
                isFetching: true,
                isLoading: true,
            })
        );

        await waitFor(() => {
            expect(hookValue.mock.calls[1][0]).toStrictEqual(
                expect.objectContaining({
                    data: [{ id: 1, title: 'foo' }],
                    isError: false,
                    isFetching: false,
                    isLoading: false,
                })
            );
        });

        // Updating ids...
        updateState([1, 2]);

        await waitFor(() => {
            expect(dataProvider.getMany).toBeCalledTimes(2);
        });

        await waitFor(() => {
            expect(hookValue).toBeCalledTimes(4);
        });

        expect(hookValue.mock.calls[2][0]).toStrictEqual(
            expect.objectContaining({
                data: undefined,
                isError: false,
                isFetching: true,
                isLoading: true,
            })
        );
        expect(hookValue.mock.calls[3][0]).toStrictEqual(
            expect.objectContaining({
                data: [
                    { id: 1, title: 'foo' },
                    { id: 2, title: 'bar' },
                ],
                isError: false,
                isFetching: false,
                isLoading: false,
            })
        );
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const dataProvider = testDataProvider({
            getMany: jest.fn(
                (_resource, { signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        });
        dataProvider.supportAbortSignal = true;
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                dataProvider={dataProvider}
                queryClient={queryClient}
            >
                <UseGetMany resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['posts', 'getMany', { ids: ['1'] }],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });

    describe('TypeScript', () => {
        it('should return the parametric type', () => {
            type Foo = { id: number; name: string };
            const _Dummy = () => {
                const { data, error, isPending } = useGetMany<Foo>('posts', {
                    ids: [1],
                });
                if (isPending || error) return null;
                return <div>{data[0].name}</div>;
            };
            // no render needed, only checking types
        });
        it('should accept empty id param', () => {
            const _Dummy = () => {
                type Post = {
                    id: number;
                    tag_ids: number[];
                };
                const { data: comment } = useGetOne<Post>('comments', {
                    id: 1,
                });
                type Tag = {
                    id: number;
                    name: string;
                };
                const { data, error, isPending } = useGetMany<Tag>('posts', {
                    ids: comment?.tag_ids,
                });
                if (isPending || error) return null;
                return (
                    <ul>
                        {data.map(tag => (
                            <li key={tag.id}>{tag.name}</li>
                        ))}
                    </ul>
                );
            };
            // no render needed, only checking types
        });
    });
});
