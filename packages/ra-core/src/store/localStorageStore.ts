import { Store } from './types';

type Subscription = {
    key: string;
    callback: (value: any) => void;
};

const RA_STORE = 'RaStore';

// localStorage isn't available in incognito mode. We need to detect it
const testLocalStorage = () => {
    // eslint-disable-next-line eqeqeq
    if (typeof window === 'undefined' || window.localStorage == undefined) {
        return false;
    }

    try {
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
};

let localStorageAvailable = testLocalStorage();

/**
 * Store using localStorage, or memory storage in incognito mode
 *
 * @example
 *
 * import { localStorageStore } from 'react-admin';
 *
 * const App = () => (
 *    <Admin store={localStorageStore()}>
 *       ...
 *   </Admin>
 * );
 */
export const localStorageStore = (
    version: string = '1',
    appKey: string = ''
): Store => {
    const prefix = `${RA_STORE}${appKey}`;
    const prefixLength = prefix.length;
    const subscriptions: { [key: string]: Subscription } = {};
    const publish = (key: string, value: any) => {
        Object.keys(subscriptions).forEach(id => {
            if (!subscriptions[id]) return; // may happen if a component unmounts after a first subscriber was notified
            if (subscriptions[id].key === key) {
                subscriptions[id].callback(value);
            }
        });
    };

    // Whenever the local storage changes in another document, look for matching subscribers.
    // This allows to synchronize state across tabs
    const onLocalStorageChange = (event: StorageEvent): void => {
        if (event.key?.substring(0, prefixLength) !== prefix) {
            return;
        }
        const key = event.key.substring(prefixLength + 1);
        const value = event.newValue ? tryParse(event.newValue) : undefined;
        Object.keys(subscriptions).forEach(id => {
            if (!subscriptions[id]) return; // may happen if a component unmounts after a first subscriber was notified
            if (subscriptions[id].key === key) {
                if (value === null) {
                    // an event with a null value is sent when the key is deleted.
                    // to enable default value, we need to call setValue(undefined) instead of setValue(null)
                    subscriptions[id].callback(undefined);
                } else {
                    subscriptions[id].callback(
                        value == null ? undefined : value
                    );
                }
            }
        });
    };

    return {
        setup: () => {
            if (localStorageAvailable) {
                const storedVersion = getStorage().getItem(`${prefix}.version`);
                if (storedVersion && storedVersion !== version) {
                    const storage = getStorage();
                    Object.keys(storage).forEach(key => {
                        if (key.startsWith(prefix)) {
                            storage.removeItem(key);
                        }
                    });
                }
                getStorage().setItem(`${prefix}.version`, version);
                window.addEventListener('storage', onLocalStorageChange);
            }
        },
        teardown: () => {
            if (localStorageAvailable) {
                window.removeEventListener('storage', onLocalStorageChange);
            }
        },
        getItem<T = any>(key: string, defaultValue?: T): T {
            const valueFromStorage = getStorage().getItem(`${prefix}.${key}`);

            // eslint-disable-next-line eqeqeq
            return valueFromStorage == null
                ? defaultValue
                : tryParse(valueFromStorage);
        },
        setItem<T = any>(key: string, value: T): void {
            if (value === undefined) {
                getStorage().removeItem(`${prefix}.${key}`);
            } else {
                getStorage().setItem(`${prefix}.${key}`, JSON.stringify(value));
            }
            publish(key, value);
        },
        removeItem(key: string): void {
            getStorage().removeItem(`${prefix}.${key}`);
            publish(key, undefined);
        },
        removeItems(keyPrefix: string): void {
            const storage = getStorage();
            Object.keys(storage).forEach(key => {
                if (key.startsWith(`${prefix}.${keyPrefix}`)) {
                    storage.removeItem(key);
                    const publishKey = key.substring(prefixLength + 1);
                    publish(publishKey, undefined);
                }
            });
        },
        reset(): void {
            const storage = getStorage();
            Object.keys(storage).forEach(key => {
                if (key.startsWith(prefix)) {
                    storage.removeItem(key);
                    const publishKey = key.substring(prefixLength + 1);
                    publish(publishKey, undefined);
                }
            });
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
    } catch (e) {
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

    removeItems(keyPrefix: string) {
        this.valuesMap.forEach((value, key) => {
            if (key.startsWith(keyPrefix)) {
                this.valuesMap.delete(key);
            }
        });
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
        const arr = Array.from(this.valuesMap.keys()) as string[];
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
