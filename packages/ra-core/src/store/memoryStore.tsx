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
    let storage = new Map<string, any>(Object.entries(initialStorage ?? {}));
    const subscriptions: { [key: string]: Subscription } = {};
    let initialized = false;
    let itemsToSetAfterInitialization: Record<string, unknown> = {};

    const publish = (key: string, value: any) => {
        Object.keys(subscriptions).forEach(id => {
            if (!subscriptions[id]) return; // may happen if a component unmounts after a first subscriber was notified
            if (subscriptions[id].key === key) {
                subscriptions[id].callback(value);
            }
        });
    };

    return {
        setup: () => {
            storage = new Map<string, any>(Object.entries(initialStorage));

            // Because children might call setItem before the store is initialized,
            // we store those calls parameters and apply them once the store is ready
            if (Object.keys(itemsToSetAfterInitialization).length > 0) {
                const items = Object.entries(itemsToSetAfterInitialization);
                for (const [key, value] of items) {
                    storage.set(key, value);
                    publish(key, value);
                }
                itemsToSetAfterInitialization = {};
            }

            initialized = true;
        },
        teardown: () => {
            storage.clear();
        },
        getItem<T = any>(key: string, defaultValue?: T): T {
            return storage.has(key)
                ? (storage.get(key) as T)
                : (defaultValue as T);
        },
        setItem<T = any>(key: string, value: T): void {
            // Because children might call setItem before the store is initialized,
            // we store those calls parameters and apply them once the store is ready
            if (!initialized) {
                itemsToSetAfterInitialization[key] = value;
                return;
            }
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
