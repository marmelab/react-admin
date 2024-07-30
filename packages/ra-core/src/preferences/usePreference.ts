import { useStore } from '../store/useStore';
import { usePreferenceKey } from './PreferenceKeyContext';

/**
 * Get a preference value from the store
 *
 * Relies on the store, using a key namespaced with the preference key from the PreferenceKeyContext
 * @example
 *
 * // when used inside a PreferenceKeyContext of value 'my-app'
 * const [theme, setTheme] = usePreference('theme', 'light');
 * // this is equivalent to
 * const [theme, setTheme] = useStore('my-app.theme', 'light');
 */
export const usePreference = <T = any>(key?: string, defaultValue?: T) => {
    const preferenceKey = usePreferenceKey();
    if (!preferenceKey) {
        throw new Error(
            "usePreference cannot be used outside of a Configurable component. Did you forget to wrap your component with <Configurable>? If you don't want to use Configurable, you can use the useStore hook instead."
        );
    }

    return useStore<T>(
        preferenceKey && key ? `${preferenceKey}.${key}` : preferenceKey ?? key,
        defaultValue
    );
};
