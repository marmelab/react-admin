import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { useGetManyAggregate } from './useGetManyAggregate';
import { testDataProvider } from '../dataProvider';

const UseGetManyAggregate = ({
    resource,
    ids,
    options = {},
    callback = null,
}) => {
    const hookValue = useGetManyAggregate(resource, { ids }, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetManyAggregate', () => {
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
                <UseGetManyAggregate resource="posts" ids={[1]} />
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
                <UseGetManyAggregate
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
                <UseGetManyAggregate
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
                <UseGetManyAggregate resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
    });

    it('should not call dataProvider.getMany() if ids is empty', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(0);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[]} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(0);
    });

    it('should recall dataProvider.getMany() when ids changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1, 2]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('should recall dataProvider.getMany() when resource changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="comments" ids={[1]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('should use data from query cache on mount', async () => {
        const FetchGetMany = () => {
            useGetManyAggregate('posts', { ids: ['1'] });
            return <span>dummy</span>;
        };
        const hookValue = jest.fn();
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <FetchGetMany />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1]}
                    callback={hookValue}
                />
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
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1]}
                    callback={hookValue}
                />
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
                <UseGetManyAggregate
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
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1]}
                    options={{ onError }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(new Error('failed'));
        });
    });

    it('should aggregate multiple calls for the same resource into one', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1, 2]} />
                <UseGetManyAggregate resource="posts" ids={[3, 4]} />
                <UseGetManyAggregate resource="posts" ids={[5, 6]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2, 3, 4, 5, 6],
            });
        });
    });

    it('should not aggregate multiple calls for different resources', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1, 2]} />
                <UseGetManyAggregate resource="posts" ids={[3, 4]} />
                <UseGetManyAggregate resource="comments" ids={[5, 6]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2, 3, 4],
            });
            expect(dataProvider.getMany).toHaveBeenCalledWith('comments', {
                ids: [5, 6],
            });
        });
    });

    it('should deduplicated repeated ids', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate resource="posts" ids={[1, 2]} />
                <UseGetManyAggregate resource="posts" ids={[2, 3]} />
                <UseGetManyAggregate resource="posts" ids={[3, 4]} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2, 3, 4],
            });
        });
    });

    it('should aggregate multiple calls for the same resource into one even if one of the calls requests all the aggregated ids', async () => {
        const firstCallback = jest.fn();
        const secondCallback = jest.fn();
        const thirdCallback = jest.fn();
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [
                    { id: 1, title: 'one' },
                    { id: 2, title: 'two' },
                    { id: 3, title: 'three' },
                ],
            }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1]}
                    callback={firstCallback}
                />
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1, 2]}
                    callback={secondCallback}
                />
                <UseGetManyAggregate
                    resource="posts"
                    ids={[1, 2, 3]}
                    callback={thirdCallback}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2, 3],
            });
        });

        await waitFor(() => {
            expect(firstCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [{ id: 1, title: 'one' }],
                })
            );
        });

        expect(secondCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [
                    { id: 1, title: 'one' },
                    { id: 2, title: 'two' },
                ],
            })
        );
        expect(thirdCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [
                    { id: 1, title: 'one' },
                    { id: 2, title: 'two' },
                    { id: 3, title: 'three' },
                ],
            })
        );
    });
});
