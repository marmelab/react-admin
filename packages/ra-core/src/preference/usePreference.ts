import { useState, useCallback, useEffect } from 'react';

import { usePreferenceProvider } from './usePreferenceProvider';

/**
 * Read and write a preference value from the preferenceProvider
 *
 * useState-like hook using the preferenceProvider for persistence.
 * Each time a preference is changed, all components using this preference will be re-rendered.
 *
 * @param {string} path Name of the preference. Separate with dots to namespace, e.g. 'posts.list.columns'. Leave empty to retrieve the entire preference tree.
 * @param {any} defaultValue Default value
 *
 * @return {Object} A value and a setter for the value, in an array - just like for useState()
 *
 * @example
 * import { usePreference } from '@react-admin/ra-preferences';
 *
 * const PostList = props => {
 *     const [density] = usePreference('posts.list.density', 'small');
 *
 *     return (
 *         <List {...props}>
 *             <Datagrid size={density}>
 *                 ...
 *             </Datagrid>
 *         </List>
 *     );
 * }
 *
 * // Clicking on this button will trigger a rerender of the PostList!
 * const ChangeDensity: FC<any> = () => {
 *     const [density, setDensity] = usePreference('posts.list.density', 'small');
 *
 *     const changeDensity = (): void => {
 *         setDensity(density === 'small' ? 'medium' : 'small');
 *     };
 *
 *     return (
 *         <Button onClick={changeDensity}>
 *             {`Change density (current ${density})`}
 *         </Button>
 *     );
 * };
 */
export const usePreference = <T = any>(
    key: string,
    defaultValue?: T
): UsePreferenceResult<T> => {
    const { getItem, setItem, subscribe } = usePreferenceProvider();
    const [value, setValue] = useState(() => getItem(key, defaultValue));

    useEffect(() => {
        const unsubscribe = subscribe(key, newValue => {
            setValue(typeof newValue === 'undefined' ? defaultValue : newValue);
        });
        return () => unsubscribe();
    }, [key, subscribe, defaultValue]);

    const set = useCallback(
        (value, runtimeDefaultValue) => {
            setItem(
                key,
                typeof value === 'undefined'
                    ? typeof runtimeDefaultValue === 'undefined'
                        ? defaultValue
                        : runtimeDefaultValue
                    : value
            );
        },
        [key, setItem, defaultValue]
    );
    return [value, set];
};

export type UsePreferenceResult<T = any> = [
    T,
    (value: T, defaultValue?: T) => void
];
