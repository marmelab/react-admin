import { useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

// TODO: create BL cards to deprecate the one in EE and use this one instead

// Hook somewhat equivalent to useEvent, but with a debounce
// Returns a debounced callback which will not change across re-renders unless the
// callback or delay changes
export const useDebouncedEvent = (callback, delay: number) => {
    // Create a ref that stores the debounced callback
    const debouncedCallbackRef = useRef(debounce(callback, delay));

    // Whenever callback or delay changes, we need to update the debounced callback
    useEffect(() => {
        debouncedCallbackRef.current = debounce(callback, delay);
    }, [callback, delay]);

    // The function returned by useCallback will invoke the debounced callback
    // Its dependencies array is empty, so it never changes across re-renders
    return useCallback((...args) => debouncedCallbackRef.current(...args), []);
};
