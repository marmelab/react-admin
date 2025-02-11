import * as React from 'react';
import { useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useEvent } from './useEvent';

// allow the hook to work in SSR
const useLayoutEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * Hook somewhat equivalent to useEvent, but with a debounce
 * Returns a debounced callback which will not change across re-renders unless the
 * callback or delay changes
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 * @see https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
export const useDebouncedEvent = <Args extends unknown[], Return>(
    callback: (...args: Args) => Return,
    delay: number
) => {
    // Create a ref that stores the debounced callback
    const debouncedCallbackRef = useRef<(...args: Args) => Return | undefined>(
        () => {
            throw new Error('Cannot call an event handler while rendering.');
        }
    );

    // Keep a stable ref to the callback (in case it's an inline function for instance)
    const stableCallback = useEvent(callback);

    // Whenever callback or delay changes, we need to update the debounced callback
    useLayoutEffect(() => {
        debouncedCallbackRef.current = debounce(stableCallback, delay);
    }, [stableCallback, delay]);

    // The function returned by useCallback will invoke the debounced callback
    // Its dependencies array is empty, so it never changes across re-renders
    return useCallback(
        (...args: Args) => debouncedCallbackRef.current(...args),
        []
    );
};
