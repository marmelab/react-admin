import { useContext, useState, useCallback, useEffect } from 'react';

import { PreferenceContext } from './PreferenceContext';

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
export const usePreference = (key: string, defaultValue?: any) => {
    const { getPreference, setPreference, subscribe } = useContext(
        PreferenceContext
    );
    const [value, setValue] = useState(() => getPreference(key, defaultValue));

    useEffect(() => {
        const unsubscribe = subscribe(key, newValue => {
            setValue(typeof newValue === 'undefined' ? defaultValue : newValue);
        });
        return () => unsubscribe();
    }, [key, subscribe, defaultValue]);

    const set = useCallback(
        (value, defaultValue) => {
            setPreference(
                key,
                typeof value === 'undefined' ? defaultValue : value
            );
        },
        [key, setPreference]
    );
    return [value, set];
};
