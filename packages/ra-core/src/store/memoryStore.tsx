import { Store } from './types';

type Subscription = {
    key: string;
    callback: (value: any) => void;
};

/**
 * Store using memory
 *
 * @example
 *
 * import { memoryStore } from 'react-admin';
 *
 * const App = () => (
 *    <Admin store={memoryStore()}>
 *       ...
 *   </Admin>
 * );
 */
export const memoryStore = (
    initialStorage: Record<string, any> = {}
): Store => {
    // Use a flat Map to store key-value pairs directly without treating dots as nested paths
    const storage = new Map<string, any>(
        Object.entries(flatten(initialStorage))
    );
    const subscriptions: { [key: string]: Subscription } = {};

    const publish = (key: string, value: any) => {
        Object.keys(subscriptions).forEach(id => {
            if (!subscriptions[id]) return; // may happen if a component unmounts after a first subscriber was notified
            if (subscriptions[id].key === key) {
                subscriptions[id].callback(value);
            }
        });
    };

    return {
        setup: () => {},
        teardown: () => {
            storage.clear();
        },
        getItem<T = any>(key: string, defaultValue?: T): T {
            return storage.has(key)
                ? (storage.get(key) as T)
                : (defaultValue as T);
        },
        setItem<T = any>(key: string, value: T): void {
            storage.set(key, value);
            publish(key, value);
        },
        removeItem(key: string): void {
            storage.delete(key);
            publish(key, undefined);
        },
        removeItems(keyPrefix: string): void {
            const keysToDelete: string[] = [];
            storage.forEach((_, key) => {
                if (key.startsWith(keyPrefix)) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach(key => {
                storage.delete(key);
                publish(key, undefined);
            });
        },
        reset(): void {
            const keysToDelete: string[] = [];
            storage.forEach((_, key) => {
                keysToDelete.push(key);
            });
            storage.clear();
            keysToDelete.forEach(key => {
                publish(key, undefined);
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

// taken from https://stackoverflow.com/a/19101235/1333479
const flatten = (data: any) => {
    const result = {};
    function doFlatten(current, prop) {
        if (Object(current) !== current) {
            // scalar value
            result[prop] = current;
        } else if (Array.isArray(current)) {
            // array
            result[prop] = current;
        } else {
            // object
            let isEmpty = true;
            for (const p in current) {
                isEmpty = false;
                doFlatten(current[p], prop ? prop + '.' + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    doFlatten(data, '');
    return result;
};
