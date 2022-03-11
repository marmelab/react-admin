import { useState, useEffect } from 'react';

import { useEventCallback } from '../util';
import { useStoreContext } from './useStoreContext';

/**
 * Read and write a value from the Store
 *
 * useState-like hook using the global Store for persistence.
 * Each time a store value is changed, all components using this value will be re-rendered.
 *
 * @param {string} key Name of the store key. Separate with dots to namespace, e.g. 'posts.list.columns'.
 * @param {any} defaultValue Optional. Default value
 * @param {Function} validate Optional. A function that will be called to validate for the default value, the initial value from the store if any and when the value is updated using the setter. If it returns false for the default value, a warning will be shown in development mode. For the value and the setter, the value will be ignored and replaced by the default value when this validate function returns false.
 *
 * @return {Object} A value and a setter for the value, in an array - just like for useState()
 *
 * @example
 * import { useStore } from 'react-admin';
 *
 * const PostList = props => {
 *     const [density] = useStore('posts.list.density', 'small');
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
    defaultValue?: T,
    validate?: ValidateStoreValue<T>
): UseStoreResult<T> => {
    const { getItem, setItem, subscribe } = useStoreContext();
    if (
        typeof validate === 'function' &&
        typeof defaultValue !== 'undefined' &&
        !validate(defaultValue)
    ) {
        console.warn(`Invalid default value for store key ${key}`);
    }
    const [value, setValue] = useState(() => getItem(key, defaultValue));

    useEffect(() => {
        if (typeof validate === 'function' && !validate(value)) {
            console.warn(`Invalid value for store key ${key}`);
            setValue(defaultValue);
        }
    }, [defaultValue, key, value, validate]);

    // subscribe to changes on this key, and change the state when they happen
    useEffect(() => {
        const unsubscribe = subscribe(key, newValue => {
            if (typeof validate === 'function' && !validate(newValue)) {
                console.warn(`Invalid value for store key ${key}`);
                setValue(defaultValue);
            } else {
                setValue(
                    typeof newValue === 'undefined' ? defaultValue : newValue
                );
            }
        });
        return () => unsubscribe();
    }, [key, subscribe, defaultValue, validate]);

    const set = useEventCallback(
        (
            valueParam: T | StoreValueSetterFunction<T>,
            runtimeDefaultValue: T
        ) => {
            const newValue =
                typeof valueParam === 'function'
                    ? (valueParam as StoreValueSetterFunction<T>)(value)
                    : valueParam;

            if (typeof validate === 'function') {
                if (!validate(newValue)) {
                    console.warn(`Invalid value for store key ${key}`);

                    if (!validate(runtimeDefaultValue)) {
                        console.warn(
                            `Invalid default value for store key ${key}`
                        );
                    }
                }
            }
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
        },
        [key, setItem, defaultValue, value]
    );
    return [value, set];
};

export type UseStoreResult<T = any> = [T, StoreValueSetter<T>];

export type StoreValueSetter<T> = (
    value: T | StoreValueSetterFunction<T>,
    defaultValue?: T
) => void;
export type StoreValueSetterFunction<T = any> = (value: T) => T;

export type ValidateStoreValue<T = any> = (value: T) => boolean;
