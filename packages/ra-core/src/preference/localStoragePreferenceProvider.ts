import { PreferenceProvider } from './types';

type Subscription = {
    key: string;
    callback: (value: any) => void;
};

const RA_PREFERENCE = 'RaPreference';
const prefixLength = RA_PREFERENCE.length;

// localStorage isn't available in incognito mode. We need to detect it
const testLocalStorage = () => {
    // eslint-disable-next-line eqeqeq
    if (window.localStorage == undefined) {
        return false;
    }

    try {
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
        return true;
    } catch {
        return false;
    }
};

let localStorageAvailable = testLocalStorage();

/**
 * PreferenceProvider using localStorage, or memory storage in incognito mode
 *
 * @example
 *
 * import { localStorageProvider } from 'react-admin';
 *
 * const App = () => (
 *    <Admin prefProvider={localStorageProvider()}>
 *       ...
 *   </Admin>
 * );
 */
export const localStoragePreferenceProvider = (): PreferenceProvider => {
    const subscriptions: { [key: string]: Subscription } = {};

    // Whenever the local storage changes in another document, look for matching subscribers.
    // This allows to synchronize preferences across tabs
    const onLocalStorageChange = (event: StorageEvent): void => {
        if (event.key.substring(0, prefixLength) !== RA_PREFERENCE) {
            return;
        }
        const key = event.key.substring(prefixLength + 1);
        Object.keys(subscriptions).forEach(id => {
            if (subscriptions[id].key === key) {
                subscriptions[id].callback(tryParse(event.newValue));
            }
        });
    };

    return {
        setup: () => {
            if (localStorageAvailable) {
                window.addEventListener('storage', onLocalStorageChange);
            }
        },
        teardown: () => {
            if (localStorageAvailable) {
                window.removeEventListener('storage', onLocalStorageChange);
            }
        },
        getItem<T = any>(key: string, defaultValue?: T): T {
            const valueFromStorage = tryParse(
                getStorage().getItem(`${RA_PREFERENCE}.${key}`)
            );
            // eslint-disable-next-line eqeqeq
            return valueFromStorage == null ? defaultValue : valueFromStorage;
        },
        setItem<T = any>(key: string, value: T): void {
            if (value === undefined) {
                getStorage().removeItem(`${RA_PREFERENCE}.${key}`);
            } else {
                getStorage().setItem(
                    `${RA_PREFERENCE}.${key}`,
                    JSON.stringify(value)
                );
            }
            // notify subscribers for this key
            Object.keys(subscriptions).forEach(id => {
                if (subscriptions[id].key === key) {
                    subscriptions[id].callback(value);
                }
            });
        },
        removeItem(key: string): void {
            getStorage().removeItem(`${RA_PREFERENCE}.${key}`);
        },
        reset(): void {
            const storage = getStorage();
            for (var i = 0; i < storage.length; i++) {
                if (
                    storage.key(i).substring(0, prefixLength) === RA_PREFERENCE
                ) {
                    storage.removeItem(storage.key(i));
                }
            }
        },
        subscribe: (key: string, callback: (value: string) => void) => {
            const id = Math.random().toString();
            subscriptions[id] = {
                key,
                callback,
            };
            return () => {
                delete subscriptions[id];
            };
        },
    };
};

const tryParse = (value: string): any => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};
class LocalStorageShim {
    valuesMap: any = new Map();

    getItem(key: string) {
        if (this.valuesMap.has(key)) {
            return String(this.valuesMap.get(key));
        }
        return null;
    }

    setItem(key: string, value: string) {
        this.valuesMap.set(key, value);
    }

    removeItem(key: string) {
        this.valuesMap.delete(key);
    }

    clear() {
        this.valuesMap.clear();
    }

    key(i): string {
        if (arguments.length === 0) {
            throw new TypeError(
                "Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present."
            ); // this is a TypeError implemented on Chrome, Firefox throws Not enough arguments to Storage.key.
        }
        var arr = Array.from(this.valuesMap.keys()) as string[];
        return arr[i];
    }

    get length() {
        return this.valuesMap.size;
    }
}
const memoryStorage = new LocalStorageShim();

export const getStorage = () => {
    return localStorageAvailable ? window.localStorage : memoryStorage;
};
