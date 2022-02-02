import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { useExpanded } from './useExpanded';
import { StoreSetter, StoreContextProvider, memoryStore } from '../../store';

describe('useExpanded', () => {
    const wrapper = ({ children }) => (
        <StoreContextProvider value={memoryStore()}>
            {children}
        </StoreContextProvider>
    );

    it('should return false by default', () => {
        const { result } = renderHook(() => useExpanded('foo', 123), {
            wrapper,
        });
        const [expanded] = result.current;
        expect(expanded).toEqual(false);
    });

    it('should use the stored value', () => {
        const { result } = renderHook(() => useExpanded('foo', 123), {
            wrapper: ({ children }) => (
                <StoreContextProvider value={memoryStore()}>
                    <StoreSetter
                        name="foo.datagrid.expanded"
                        value={[123, 456]}
                    >
                        {children}
                    </StoreSetter>
                </StoreContextProvider>
            ),
        });
        const [expanded] = result.current;
        expect(expanded).toEqual(true);
    });

    it('should allow to toggle the state', () => {
        const { result } = renderHook(() => useExpanded('foo', 789), {
            wrapper,
        });
        const [expanded1, toggleExpanded1] = result.current;
        expect(expanded1).toEqual(false);
        toggleExpanded1();
        const [expanded2, toggleExpanded2] = result.current;
        expect(expanded2).toEqual(true);
        toggleExpanded2();
        const [expanded3] = result.current;
        expect(expanded3).toEqual(false);
    });
});
