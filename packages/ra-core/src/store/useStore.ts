import { useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

import { useEvent } from '../util';
import { useStoreContext } from './useStoreContext';

/**
 * Read and write a value from the Store
 *
 * useState-like hook using the global Store for persistence.
 * Each time a store value is changed, all components using this value will be re-rendered.
 *
 * @param {string} key Name of the store key. Separate with dots to namespace, e.g. 'posts.list.columns'.
 * @param {any} defaultValue Default value
 *
 * @return {Object} A value and a setter for the value, in an array - just like for useState()
 *
 * @example
 * import { useStore } from 'react-admin';
 *
 * const PostList = () => {
 *     const [density] = useStore('posts.list.density', 'small');
 *
 *     return (
 *         <List>
 *             <Datagrid size={density}>
 *                 ...
 *             </Datagrid>
 *         </List>
 *     );
 * }
 *
 * // Clicking on this button will trigger a rerender of the PostList!
 * const ChangeDensity: FC<any> = () => {
 *     const [density, setDensity] = useStore('posts.list.density', 'small');
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
export const useStore = <T = any>(
    key: string,
    defaultValue?: T
): useStoreResult<T> => {
    const { getItem, setItem, subscribe } = useStoreContext();
    const [value, setValue] = useState(() => getItem(key, defaultValue));

    // subscribe to changes on this key, and change the state when they happen
    useEffect(() => {
        const storedValue = getItem(key, defaultValue);
        if (!isEqual(value, storedValue)) {
            setValue(storedValue);
        }
        const unsubscribe = subscribe(key, newValue => {
            setValue(typeof newValue === 'undefined' ? defaultValue : newValue);
        });
        return () => unsubscribe();
    }, [key, subscribe, defaultValue, getItem, value]);

    const set = useEvent((valueParam: T, runtimeDefaultValue: T) => {
        const newValue =
            typeof valueParam === 'function' ? valueParam(value) : valueParam;
        // we only set the value in the Store;
        // the value in the local state will be updated
        // by the useEffect during the next render
        setItem(
            key,
            typeof newValue === 'undefined'
                ? typeof runtimeDefaultValue === 'undefined'
                    ? defaultValue
                    : runtimeDefaultValue
                : newValue
        );
    });
    return [value, set];
};

export type useStoreResult<T = any> = [
    T,
    (value: T | ((value: T) => void), defaultValue?: T) => void
];
