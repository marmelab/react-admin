import { useEffect, useRef } from 'react';
import { useEvent } from './useEvent';

/**
 * A hook that checks if the application code has changed and call the provided onNewVersionAvailable function when needed.
 * It checks for code update by downloading the provided URL (default to the HTML page) and
 * comparing the hash of the response with the hash of the current page.
 *
 * @param {UseCheckForApplicationUpdateOptions} options The options
 * @param {Function} options.onNewVersionAvailable The function to call when a new version of the application is available.
 * @param {string} options.url Optional. The URL to download to check for code update. Defaults to the current URL.
 * @param {number} options.checkInterval Optional. The interval in milliseconds between two checks. Defaults to 3600000 (1 hour).
 * @param {boolean} options.disabled Optional. Whether the check should be disabled. Defaults to false.
 */
export const useCheckForApplicationUpdate = (
    options: UseCheckForApplicationUpdateOptions
) => {
    const {
        url = window.location.href,
        checkInterval = ONE_HOUR,
        onNewVersionAvailable,
        disabled,
    } = options;
    const currentHash = useRef<string>();
    const onCodeHasChanged = useEvent(onNewVersionAvailable);

    useEffect(() => {
        if (disabled) return;

        getHashForUrl(url).then(hash => {
            currentHash.current = hash;
        });
    }, [disabled, url]);

    useEffect(() => {
        if (disabled) return;

        const interval = setInterval(() => {
            getHashForUrl(url).then(hash => {
                if (currentHash.current !== hash) {
                    onCodeHasChanged();
                }
            });
        }, checkInterval);
        return () => clearInterval(interval);
    }, [checkInterval, onCodeHasChanged, disabled, url]);
};

const getHashForUrl = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text();
    return hash(text);
};

const hash = (value: string) => {
    return value
        .split('')
        .reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0)
        .toString();
};

const ONE_HOUR = 1000 * 60 * 60;

export interface UseCheckForApplicationUpdateOptions {
    onNewVersionAvailable: () => void;
    checkInterval?: number;
    url?: string;
    disabled?: boolean;
}
