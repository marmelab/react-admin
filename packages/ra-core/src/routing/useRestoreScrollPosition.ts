import { useEffect } from 'react';
import { useStore } from '../store';
import { debounce } from 'lodash';
import { useLocation } from 'react-router';

/**
 * A hook that tracks the scroll position and restores it when the component mounts.
 * @param key The key under which to store the scroll position in the store
 * @param debounceMs The debounce time in milliseconds
 *
 * @example
 * import { ListBase, useRestoreScrollPosition } from 'ra-core';
 *
 * const MyCustomList = (props) => {
 *    useRestoreScrollPosition('my-list');
 *   return <ListBase {...props} />;
 * };
 */
export const useRestoreScrollPosition = (key: string, debounceMs = 250) => {
    const position = useTrackScrollPosition(key, debounceMs);
    const location = useLocation();

    useEffect(() => {
        if (position != null && location.state?._scrollToTop !== true) {
            window.scrollTo(0, position);
        }
        // We only want to run this effect on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export const useTrackScrollPosition = (key: string, debounceMs = 250) => {
    const [position, setPosition] = useStore(key);

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

    return position;
};
