import { useEffect } from 'react';
import { useLocation } from 'react-router';
import debounce from 'lodash/debounce';

import { useStore } from '../store';

/**
 * A hook that tracks the scroll position and restores it when the component mounts.
 * @param storeKey The key under which to store the scroll position in the store
 * @param debounceMs The debounce time in milliseconds
 *
 * @example
 * import { useRestoreScrollPosition } from 'ra-core';
 *
 * const MyCustomPage = () => {
 *   useRestoreScrollPosition('my-list');
 *
 *   return (
 *     <div>
 *       <h1>My Custom Page</h1>
 *       <VeryLongContent />
 *     </div>
 *   );
 * };
 */
export const useRestoreScrollPosition = (
    storeKey: string,
    debounceMs = 250
) => {
    const [position, setPosition] = useTrackScrollPosition(
        storeKey,
        debounceMs
    );
    const location = useLocation();

    useEffect(() => {
        if (position != null && location.state?._scrollToTop !== true) {
            setPosition(undefined);
            window.scrollTo(0, position);
        }
        // We only want to run this effect on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

/**
 * A hook that tracks the scroll position and stores it.
 * @param storeKey The key under which to store the scroll position in the store
 * @param debounceMs The debounce time in milliseconds
 *
 * @example
 * import { useTrackScrollPosition } from 'ra-core';
 *
 * const MyCustomPage = () => {
 *   useTrackScrollPosition('my-list');
 *
 *   return (
 *     <div>
 *       <h1>My Custom Page</h1>
 *       <VeryLongContent />
 *     </div>
 *   );
 * };
 */
export const useTrackScrollPosition = (storeKey: string, debounceMs = 250) => {
    const [position, setPosition] = useStore(storeKey);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const handleScroll = debounce(() => {
            setPosition(window.scrollY);
        }, debounceMs);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [debounceMs, setPosition]);

    return [position, setPosition];
};
