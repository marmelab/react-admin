import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * A hook to use inside the component passed to FallbackComponent
 * of react-error-boundary. It resets the error boundary state whenever
 * the location changes
 * @param {Function} resetErrorBoundary
 */
export const useResetErrorBoundaryOnLocationChange = (
    resetErrorBoundary: () => void
) => {
    const { pathname } = useLocation();
    const originalPathname = useRef(pathname);

    useEffect(() => {
        if (pathname !== originalPathname.current) {
            resetErrorBoundary();
        }
    }, [pathname, resetErrorBoundary]);
};
