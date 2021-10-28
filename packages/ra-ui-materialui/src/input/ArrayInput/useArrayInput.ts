import { useContext, useMemo } from 'react';
import { ArrayInputContext, ArrayInputContextValue } from './ArrayInputContext';

/**
 * A hook to access an array input mutators and meta as provided by react-hook-form-array.
 * Useful to create custom array input iterators.
 * @see {ArrayInput}
 */
export const useArrayInput = (
    props?: Partial<ArrayInputContextValue>
): ArrayInputContextValue => {
    const context = useContext(ArrayInputContext);
    const memo = useMemo(
        () => ({
            swap: props.swap,
            move: props.move,
            prepend: props.prepend,
            append: props.append,
            remove: props.remove,
            insert: props.insert,
            update: props.update,
            replace: props.replace,
            fields: props.fields,
        }),
        [props]
    );

    if (props?.fields) {
        return memo;
    }

    return context;
};
