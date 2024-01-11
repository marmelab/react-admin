import { useEffect, useRef } from 'react';
import { useEvent } from './useEvent';

/**
 * Checks if the application code has changed and calls the provided onNewVersionAvailable function when needed.
 *
 * It checks for code update by downloading the provided URL (default to the HTML page) and
 * comparing the hash of the response with the hash of the current page.
 *
 * @param {UseCheckForApplicationUpdateOptions} options The options
 * @param {Function} options.onNewVersionAvailable The function to call when a new version of the application is available.
 * @param {string} options.url Optional. The URL to download to check for code update. Defaults to the current URL.
 * @param {RequestInit} options.fetchOptions Optional. The options passed to fetch function when checking for update.
 * @param {number} options.interval Optional. The interval in milliseconds between two checks. Defaults to 3600000 (1 hour).
 * @param {boolean} options.disabled Optional. Whether the check should be disabled. Defaults to false.
 */
export const useCheckForApplicationUpdate = (
    options: UseCheckForApplicationUpdateOptions
) => {
    const {
        url = window.location.href,
        fetchOptions,
        interval: delay = ONE_HOUR,
        onNewVersionAvailable: onNewVersionAvailableProp,
        disabled = process.env.NODE_ENV !== 'production',
    } = options;
    const currentHash = useRef<number>();
    const onNewVersionAvailable = useEvent(onNewVersionAvailableProp);

    useEffect(() => {
        if (disabled) return;

        getHashForUrl(url, fetchOptions).then(hash => {
            if (hash != null) {
                currentHash.current = hash;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, url, JSON.stringify(fetchOptions)]);

    useEffect(() => {
        if (disabled) return;

        const interval = setInterval(() => {
            getHashForUrl(url, fetchOptions)
                .then(hash => {
                    if (hash != null && currentHash.current !== hash) {
                        // Store the latest hash to avoid calling the onNewVersionAvailable function multiple times
                        // or when users have closed the notification
                        currentHash.current = hash;
                        onNewVersionAvailable();
                    }
                })
                .catch(() => {
                    // Ignore errors to avoid issues when connectivity is lost
                });
        }, delay);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        delay,
        onNewVersionAvailable,
        disabled,
        url,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(fetchOptions),
    ]);
};

const getHashForUrl = async (url: string, fetchOptions?: RequestInit) => {
    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) return null;
        const text = await response.text();
        return hash(text);
    } catch (e) {
        return null;
    }
};

// Simple hash function, taken from https://stackoverflow.com/a/52171480/3723993, suggested by Copilot
const hash = (value: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < value.length; i++) {
        ch = value.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const ONE_HOUR = 1000 * 60 * 60;

export interface UseCheckForApplicationUpdateOptions {
    onNewVersionAvailable: () => void;
    interval?: number;
    url?: string;
    fetchOptions?: RequestInit;
    disabled?: boolean;
}
