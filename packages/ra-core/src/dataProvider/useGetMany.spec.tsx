import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { useGetMany } from './useGetMany';
import { testDataProvider } from '../dataProvider';
import { useState } from 'react';

const UseGetMany = ({
    resource,
    ids,
    meta = undefined,
    options = {},
    callback = null,
}) => {
    const hookValue = useGetMany(resource, { ids, meta }, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

let updateState;

const UseCustomGetMany = ({ resource, ids, options = {}, callback = null }) => {
    const [stateIds, setStateIds] = useState(ids);
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
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [{ id: 1, title: 'foo' }],
                isFetching: false,
                isLoading: false,
                error: null,
            })
        );
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
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                error: new Error('failed'),
            })
        );
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

        expect(hookValue.mock.calls[1][0]).toStrictEqual(
            expect.objectContaining({
                data: [{ id: 1, title: 'foo' }],
                isError: false,
                isFetching: false,
                isLoading: false,
            })
        );

        // Updating ids...
        updateState([1, 2]);

        await waitFor(() => {
            expect(dataProvider.getMany).toBeCalledTimes(2);
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
                data: undefined,
                isError: false,
                isFetching: true,
                isLoading: true,
            })
        );
        expect(hookValue.mock.calls[4][0]).toStrictEqual(
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
});
