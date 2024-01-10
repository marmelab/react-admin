import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { useRecordSelection } from './useRecordSelection';
import { StoreSetter, StoreContextProvider, memoryStore } from '../../store';

describe('useRecordSelection', () => {
    const wrapper = ({ children }) => (
        <StoreContextProvider value={memoryStore()}>
            {children}
        </StoreContextProvider>
    );

    it('should return empty array by default', () => {
        const { result } = renderHook(() => useRecordSelection('foo'), {
            wrapper,
        });
        const [selected] = result.current;
        expect(selected).toEqual([]);
    });

    it('should use the stored value', () => {
        const { result } = renderHook(() => useRecordSelection('foo'), {
            wrapper: ({ children }) => (
                <StoreContextProvider value={memoryStore()}>
                    <StoreSetter name="foo.selectedIds" value={[123, 456]}>
                        {children}
                    </StoreSetter>
                </StoreContextProvider>
            ),
        });
        const [selected] = result.current;
        expect(selected).toEqual([123, 456]);
    });

    describe('select', () => {
        it('should allow to select a record', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [selected1, { select }] = result.current;
            expect(selected1).toEqual([]);
            select([123, 456]);
            const [selected2] = result.current;
            expect(selected2).toEqual([123, 456]);
        });
        it('should ignore previous selection', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [selected1, { select }] = result.current;
            expect(selected1).toEqual([]);
            select([123, 456]);
            const [selected2] = result.current;
            expect(selected2).toEqual([123, 456]);
            select([123, 789]);
            const [selected3] = result.current;
            expect(selected3).toEqual([123, 789]);
        });
    });
    describe('unselect', () => {
        it('should allow to unselect a record', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [, { select, unselect }] = result.current;
            select([123, 456]);
            unselect([123]);
            const [selected] = result.current;
            expect(selected).toEqual([456]);
        });
        it('should not fail if the record was not selected', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [, { select, unselect }] = result.current;
            select([123, 456]);
            unselect([789]);
            const [selected] = result.current;
            expect(selected).toEqual([123, 456]);
        });
    });
    describe('toggle', () => {
        it('should allow to toggle a record selection', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [selected1, { toggle }] = result.current;
            expect(selected1).toEqual([]);
            toggle(123);
            const [selected2] = result.current;
            expect(selected2).toEqual([123]);
            toggle(456);
            const [selected3] = result.current;
            expect(selected3).toEqual([123, 456]);
            toggle(123);
            const [selected4] = result.current;
            expect(selected4).toEqual([456]);
        });
        it('should allow to empty the selection', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [, { select, toggle }] = result.current;
            select([123]);
            toggle(123);
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });
    });
    describe('clearSelection', () => {
        it('should allow to clear the selection', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [, { toggle, clearSelection }] = result.current;
            toggle(123);
            const [selected2] = result.current;
            expect(selected2).toEqual([123]);
            clearSelection();
            const [selected3] = result.current;
            expect(selected3).toEqual([]);
        });
        it('should not fail on empty selection', () => {
            const { result } = renderHook(() => useRecordSelection('foo'), {
                wrapper,
            });
            const [, { clearSelection }] = result.current;
            clearSelection();
            const [selected] = result.current;
            expect(selected).toEqual([]);
        });
    });
});
