import { useEffect } from 'react';
import { useRefresh } from '../sideEffect';
import useIsAutomaticRefreshEnabled from './useIsAutomaticRefreshEnabled';

/**
 * Trigger a refresh of the page when the page comes back from background after a certain delay
 *
 * @param {number} delay Delay in milliseconds since the time the page was hidden. Defaults to 5 minutes.
 */
const useRefreshWhenVisible = (delay = 1000 * 60 * 5) => {
    const refresh = useRefresh();
    const automaticRefreshEnabled = useIsAutomaticRefreshEnabled();

    useEffect(() => {
        if (typeof document === 'undefined') return;
        let lastHiddenTime;
        const handleVisibilityChange = () => {
            if (!automaticRefreshEnabled) {
                return;
            }
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
        document.addEventListener('visibilitychange', handleVisibilityChange, {
            capture: true,
        });
        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
                { capture: true }
            );
    }, [automaticRefreshEnabled, delay, refresh]);
};

export default useRefreshWhenVisible;
