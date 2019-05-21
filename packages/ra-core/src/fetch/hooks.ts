import { useState, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

// thanks Kent C Dodds for the following helpers

export function useSafeSetState(initialState) {
    const [state, setState] = useState(initialState);

    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => (mountedRef.current = false);
    }, []);
    const safeSetState = args => mountedRef.current && setState(args);

    return [state, safeSetState];
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function useDeepCompareEffect(callback, inputs) {
    const cleanupRef = useRef();
    useEffect(() => {
        if (!isEqual(previousInputs, inputs)) {
            cleanupRef.current = callback();
        }
        return cleanupRef.current;
    });
    const previousInputs = usePrevious(inputs);
}
