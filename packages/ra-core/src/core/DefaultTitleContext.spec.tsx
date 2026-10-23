import * as React from 'react';
import { renderHook } from '@testing-library/react';

import {
    DefaultTitleContextProvider,
    useDefaultTitle,
} from './DefaultTitleContext';

describe('useDefaultTitle', () => {
    it('should return the app title', () => {
        const { result } = renderHook(() => useDefaultTitle(), {
            wrapper: ({ children }) => (
                <DefaultTitleContextProvider value="Book Store">
                    {children}
                </DefaultTitleContextProvider>
            ),
        });
        expect(result.current).toBe('Book Store');
    });

    it('should default to React Admin when the app title is not set', () => {
        const { result } = renderHook(() => useDefaultTitle(), {
            wrapper: ({ children }) => (
                <DefaultTitleContextProvider value={undefined}>
                    {children}
                </DefaultTitleContextProvider>
            ),
        });
        expect(result.current).toBe('React Admin');
    });
});
