import { useContext, useMemo } from 'react';
import { ArrayInputContext, ArrayInputContextValue } from './ArrayInputContext';

/**
 * A hook to access an array input mutators and meta as provided by react-final-form-array.
 * Useful to create custom array input iterators.
 * @see {ArrayInput}
 * @see {@link https://github.com/final-form/react-final-form-arrays|react-final-form-array}
 */
export const useArrayInput = (
    props?: Partial<ArrayInputContextValue>
): ArrayInputContextValue => {
    const context = useContext(ArrayInputContext);
    const memo = useMemo(
        () => ({
            fields: props?.fields,
            meta: props?.meta,
        }),
        [props]
    );

    if (props?.fields && props?.meta) {
        return memo;
    }

    return context;
};
