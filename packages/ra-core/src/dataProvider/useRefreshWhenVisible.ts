import { useEffect } from 'react';

import { useRefresh } from '../sideEffect';

/**
 * Trigger a refresh of the page when the page comes back from background after a certain delay
 *
 * @param {number} delay Delay in milliseconds since the time the page was hidden. Defaults to 5 minutes.
 */
const useRefreshWhenVisible = (delay = 1000 * 60 * 5) => {
    const refresh = useRefresh();
    useEffect(() => {
        let lastHiddenTime;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // tab goes hidden
                lastHiddenTime = Date.now();
            } else {
                // tab goes visible
                if (Date.now() - lastHiddenTime > delay) {
                    refresh();
                }
                lastHiddenTime = null;
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
    }, [delay, refresh]);
};

export default useRefreshWhenVisible;
