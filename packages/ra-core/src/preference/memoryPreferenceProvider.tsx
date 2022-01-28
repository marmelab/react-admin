import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';
import { PreferenceProvider } from './types';

type Subscription = {
    key: string;
    callback: (value: any) => void;
};

/**
 * PreferenceProvider using memory
 *
 * @example
 *
 * import { memoryPreferenceProvider } from 'react-admin';
 *
 * const App = () => (
 *    <Admin prefProvider={memoryPreferenceProvider()}>
 *       ...
 *   </Admin>
 * );
 */
export const memoryPreferenceProvider = (
    storage: any = {}
): PreferenceProvider => {
    const subscriptions: { [key: string]: Subscription } = {};
    return {
        setup: () => {},
        teardown: () => {
            Object.keys(storage).forEach(key => delete storage[key]);
        },
        getPreference<T = any>(key: string, defaultValue?: T): T {
            return get(storage, key, defaultValue);
        },
        setPreference<T = any>(key: string, value: T): void {
            set(storage, key, value);
            Object.keys(subscriptions).forEach(id => {
                if (subscriptions[id].key === key) {
                    subscriptions[id].callback(value);
                }
            });
        },
        removePreference(key: string): void {
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
