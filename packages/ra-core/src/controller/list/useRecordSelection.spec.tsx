import * as React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

import { useRecordSelection } from './useRecordSelection';
import { StoreSetter, StoreContextProvider, memoryStore } from '../../store';

describe('useRecordSelection', () => {
    const wrapper = ({ children }) => (
        <StoreContextProvider value={memoryStore()}>
            {children}
        </StoreContextProvider>
    );

    it('should return empty array by default', () => {
        const { result } = renderHook(
            () => useRecordSelection({ resource: 'foo' }),
            {
                wrapper,
            }
        );
        const [selected] = result.current;
        expect(selected).toEqual([]);
    });

    it('should use the stored value', () => {
        const { result } = renderHook(
            () => useRecordSelection({ resource: 'foo' }),
            {
                wrapper: ({ children }) => (
                    <StoreContextProvider value={memoryStore()}>
                        <StoreSetter name="foo.selectedIds" value={[123, 456]}>
                            {children}
                        </StoreSetter>
                    </StoreContextProvider>
                ),
            }
        );
        const [selected] = result.current;
        expect(selected).toEqual([123, 456]);
    });

    it('should store in a new format after any operation', async () => {
        const store = memoryStore();
        const { result } = renderHook(
            () => useRecordSelection({ resource: 'foo' }),
            {
                wrapper: ({ children }) => (
                    <StoreContextProvider value={store}>
                        <StoreSetter name="foo.selectedIds" value={[123, 456]}>
                            {children}
                        </StoreSetter>
                    </StoreContextProvider>
                ),
            }
        );

        const [, { select }] = result.current;
        select([123, 456, 7]);
        await waitFor(() => {
            const stored = store.getItem('foo.selectedIds');
            expect(stored).toEqual([123, 456, 7]);
        });
    });

    describe('select', () => {
        it('should allow to select a record', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [selected1, { select }] = result.current;
            expect(selected1).toEqual([]);
            select([123, 456]);
            await waitFor(() => {
                const [selected2] = result.current;
                expect(selected2).toEqual([123, 456]);
            });
        });
        it('should ignore previous selection', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [selected1, { select }] = result.current;
            expect(selected1).toEqual([]);
            select([123, 456]);
            await waitFor(() => {
                const [selected2] = result.current;
                expect(selected2).toEqual([123, 456]);
            });
            select([123, 789]);
            await waitFor(() => {
                const [selected3] = result.current;
                expect(selected3).toEqual([123, 789]);
            });
        });
    });
    describe('unselect', () => {
        it('should allow to unselect a record', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [, { select, unselect }] = result.current;
            select([123, 456]);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([123, 456]);
            });
            unselect([123]);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([456]);
            });
        });
        it('should not fail if the record was not selected', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [, { select, unselect }] = result.current;
            select([123, 456]);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([123, 456]);
            });
            unselect([789]);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([123, 456]);
            });
        });
    });
    describe('toggle', () => {
        it('should allow to toggle a record selection', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [selected1, { toggle }] = result.current;
            expect(selected1).toEqual([]);
            toggle(123);
            await waitFor(() => {
                const [selected2] = result.current;
                expect(selected2).toEqual([123]);
            });
            toggle(456);
            await waitFor(() => {
                const [selected3] = result.current;
                expect(selected3).toEqual([123, 456]);
            });
            toggle(123);
            await waitFor(() => {
                const [selected4] = result.current;
                expect(selected4).toEqual([456]);
            });
        });
        it('should allow to empty the selection', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [, { select, toggle }] = result.current;
            select([123]);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([123]);
            });
            toggle(123);
            await waitFor(() => {
                const [selected] = result.current;
                expect(selected).toEqual([]);
            });
        });
    });
    describe('clearSelection', () => {
        it('should allow to clear the selection', async () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [, { toggle, clearSelection }] = result.current;
            toggle(123);
            await waitFor(() => {
                const [selected1] = result.current;
                expect(selected1).toEqual([123]);
            });
            clearSelection();
            await waitFor(() => {
                const [selected2] = result.current;
                expect(selected2).toEqual([]);
            });
        });
        it('should not fail on empty selection', () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo' }),
                {
                    wrapper,
                }
            );
            const [, { clearSelection }] = result.current;
            clearSelection();
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });
    });
    describe('using local state', () => {
        it('should return empty array by default', () => {
            const { result } = renderHook(() =>
                useRecordSelection({
                    disableSyncWithStore: true,
                })
            );
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });

        it('should not use the stored value', () => {
            const { result } = renderHook(
                () =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    }),
                {
                    wrapper: ({ children }) => (
                        <StoreContextProvider value={memoryStore()}>
                            <StoreSetter
                                name="foo.selectedIds"
                                value={[123, 456]}
                            >
                                {children}
                            </StoreSetter>
                        </StoreContextProvider>
                    ),
                }
            );
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });

        describe('select', () => {
            it('should allow to select a record', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [selected1, { select }] = result.current;
                expect(selected1).toEqual([]);
                select([123, 456]);
                await waitFor(() => {
                    const [selected2] = result.current;
                    expect(selected2).toEqual([123, 456]);
                });
            });
            it('should ignore previous selection', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [selected1, { select }] = result.current;
                expect(selected1).toEqual([]);
                select([123, 456]);
                await waitFor(() => {
                    const [selected2] = result.current;
                    expect(selected2).toEqual([123, 456]);
                });
                select([123, 789]);
                await waitFor(() => {
                    const [selected3] = result.current;
                    expect(selected3).toEqual([123, 789]);
                });
            });
        });
        describe('unselect', () => {
            it('should allow to unselect a record', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [, { select, unselect }] = result.current;
                select([123, 456]);
                await waitFor(() => {
                    const [selected1] = result.current;
                    expect(selected1).toEqual([123, 456]);
                });
                unselect([123]);
                await waitFor(() => {
                    const [selected2] = result.current;
                    expect(selected2).toEqual([456]);
                });
            });
            it('should not fail if the record was not selected', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [, { select, unselect }] = result.current;
                select([123, 456]);
                await waitFor(() => {
                    const [selected1] = result.current;
                    expect(selected1).toEqual([123, 456]);
                });
                unselect([789]);
                await waitFor(() => {
                    const [selected] = result.current;
                    expect(selected).toEqual([123, 456]);
                });
            });
        });
        describe('toggle', () => {
            it('should allow to toggle a record selection', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [selected1, { toggle }] = result.current;
                expect(selected1).toEqual([]);
                toggle(123);
                await waitFor(() => {
                    const [selected2] = result.current;
                    expect(selected2).toEqual([123]);
                });
                toggle(456);
                await waitFor(() => {
                    const [selected3] = result.current;
                    expect(selected3).toEqual([123, 456]);
                });
                toggle(123);
                await waitFor(() => {
                    const [selected4] = result.current;
                    expect(selected4).toEqual([456]);
                });
            });
            it('should allow to empty the selection', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [, { select, toggle }] = result.current;
                select([123]);
                await waitFor(() => {
                    const [selected3] = result.current;
                    expect(selected3).toEqual([123]);
                });
                toggle(123);
                await waitFor(() => {
                    const [selected] = result.current;
                    expect(selected).toEqual([]);
                });
            });
        });
        describe('clearSelection', () => {
            it('should allow to clear the selection', async () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [, { toggle, clearSelection }] = result.current;
                toggle(123);
                await waitFor(() => {
                    const [selected2] = result.current;
                    expect(selected2).toEqual([123]);
                });
                clearSelection();
                await waitFor(() => {
                    const [selected3] = result.current;
                    expect(selected3).toEqual([]);
                });
            });
            it('should not fail on empty selection', () => {
                const { result } = renderHook(() =>
                    useRecordSelection({
                        disableSyncWithStore: true,
                    })
                );
                const [, { clearSelection }] = result.current;
                clearSelection();
                const [selected] = result.current;
                expect(selected).toEqual([]);
            });
        });
    });
    describe('using storeKey', () => {
        it('should return empty array by default', () => {
            const { result } = renderHook(
                () =>
                    useRecordSelection({
                        resource: 'foo',
                        storeKey: 'bar',
                    }),
                { wrapper }
            );
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });

        it('should use the stored value', () => {
            const { result } = renderHook(
                () => useRecordSelection({ resource: 'foo', storeKey: 'bar' }),
                {
                    wrapper: ({ children }) => (
                        <StoreContextProvider value={memoryStore()}>
                            <StoreSetter
                                name="bar.selectedIds"
                                value={[123, 456]}
                            >
                                {children}
                            </StoreSetter>
                        </StoreContextProvider>
                    ),
                }
            );
            const [selected] = result.current;
            expect(selected).toEqual([123, 456]);
        });

        it('should allow to unselect from all storeKeys', async () => {
            const { result } = renderHook(
                () => [
                    useRecordSelection({ resource: 'foo', storeKey: 'bar1' }),
                    useRecordSelection({ resource: 'foo', storeKey: 'bar2' }),
                ],
                {
                    wrapper,
                }
            );

            const [, { toggle: toggle1 }] = result.current[0];
            const [, { toggle: toggle2 }] = result.current[1];
            toggle1(123);
            await waitFor(() => {});
            toggle2(123);
            await waitFor(() => {});
            toggle2(456);
            await waitFor(() => {
                const [selected1] = result.current[0];
                expect(selected1).toEqual([123]);
                const [selected2] = result.current[1];
                expect(selected2).toEqual([123, 456]);
            });

            const [, { unselect }] = result.current[0];
            unselect([123], true);

            await waitFor(() => {
                const [selected1] = result.current[0];
                expect(selected1).toEqual([]);
                const [selected2] = result.current[1];
                expect(selected2).toEqual([456]);
            });
        });

        it('should allow to clear the selection from all storeKeys', async () => {
            const { result } = renderHook(
                () => [
                    useRecordSelection({
                        resource: 'foo',
                        storeKey: 'bar1',
                    }),
                    useRecordSelection({
                        resource: 'foo',
                        storeKey: 'bar2',
                    }),
                ],
                {
                    wrapper,
                }
            );

            const [, { toggle: toggle1 }] = result.current[0];
            const [, { toggle: toggle2 }] = result.current[1];
            toggle1(123);
            // `set` in useStore doesn't chain set calls happened in one render cycle...
            await waitFor(() => {});
            toggle2(456);
            await waitFor(() => {
                const [selected1] = result.current[0];
                expect(selected1).toEqual([123]);
                const [selected2] = result.current[1];
                expect(selected2).toEqual([456]);
            });

            const [, { clearSelection }] = result.current[0];
            clearSelection(true);

            await waitFor(() => {
                const [selected1] = result.current[0];
                expect(selected1).toEqual([]);
                const [selected2] = result.current[1];
                expect(selected2).toEqual([]);
            });
        });

        describe('using stored storeKeys', () => {
            it('should keep final storeKey in the store', async () => {
                const store = memoryStore();
                renderHook(
                    () =>
                        useRecordSelection({
                            resource: 'foo',
                            storeKey: 'bar',
                        }),
                    {
                        wrapper: ({ children }) => (
                            <StoreContextProvider value={store}>
                                {children}
                            </StoreContextProvider>
                        ),
                    }
                );

                await waitFor(() => {
                    const storeKeys = store.getItem(
                        'foo.selectedIds.storeKeys'
                    );
                    expect(storeKeys).toEqual(['bar.selectedIds']);
                });
            });

            it('should check all storeKeys listed in store when `fromAllStoreKeys` is `true`', async () => {
                const store = memoryStore();
                const { result } = renderHook(
                    () => {
                        return useRecordSelection({
                            resource: 'foo',
                            storeKey: 'bar1',
                        });
                    },
                    {
                        wrapper: ({ children }) => (
                            <StoreContextProvider value={store}>
                                <StoreSetter
                                    name={'foo.selectedIds.storeKeys'}
                                    value={['bar2.selectedIds']}
                                >
                                    <StoreSetter
                                        name={'bar1.selectedIds'}
                                        value={[123]}
                                    >
                                        <StoreSetter
                                            name={'bar2.selectedIds'}
                                            value={[123]}
                                        >
                                            {children}
                                        </StoreSetter>
                                    </StoreSetter>
                                </StoreSetter>
                            </StoreContextProvider>
                        ),
                    }
                );

                const [, { clearSelection }] = result.current;
                clearSelection(true);

                await waitFor(() => {
                    expect(store.getItem('bar1.selectedIds')).toEqual([]);
                    expect(store.getItem('bar2.selectedIds')).toEqual([]);
                });
            });
        });
    });
});
