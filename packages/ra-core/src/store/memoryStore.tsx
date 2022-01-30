import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';
import { StoreProvider } from './types';

type Subscription = {
    key: string;
    callback: (value: any) => void;
};

/**
 * StoreProvider using memory
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
export const memoryStore = (storage: any = {}): StoreProvider => {
    const subscriptions: { [key: string]: Subscription } = {};
    return {
        setup: () => {},
        teardown: () => {
            Object.keys(storage).forEach(key => delete storage[key]);
        },
        getItem<T = any>(key: string, defaultValue?: T): T {
            return get(storage, key, defaultValue);
        },
        setItem<T = any>(key: string, value: T): void {
            set(storage, key, value);
            Object.keys(subscriptions).forEach(id => {
                if (subscriptions[id].key === key) {
                    subscriptions[id].callback(value);
                }
            });
        },
        removeItem(key: string): void {
            unset(storage, key);
        },
        reset(): void {
            Object.keys(storage).forEach(key => delete storage[key]);
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
