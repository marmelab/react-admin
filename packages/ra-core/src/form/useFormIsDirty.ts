import { useFormState } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty.js';

// useFormState().isDirty might differ from useFormState().dirtyFields (https://github.com/react-hook-form/react-hook-form/issues/4740)
export const useFormIsDirty = (): boolean => {
    const { dirtyFields } = useFormState();
    return checkHasDirtyFields(dirtyFields);
};

export const checkHasDirtyFields = (
    dirtyFields: Partial<
        Readonly<{
            [x: string]: any;
        }>
    >
): boolean => {
    // dirtyFields can contains simple keys with boolean values, nested objects or arrays
    // We must ignore values that are false
    return Object.values(dirtyFields).some(value => {
        if (typeof value === 'boolean') {
            return value;
        } else if (Array.isArray(value)) {
            // Some arrays contain only booleans (scalar arrays), some arrays contain objects (object arrays)
            for (const item of value) {
                if (item === true) {
                    return true;
                }
                // FIXME: because we currently don't set default values correctly for arrays,
                // new items are either empty objects, or undefined in dirtyFields. Consider them as dirty.
                if (
                    (typeof item === 'object' && isEmpty(item)) ||
                    item === undefined
                ) {
                    return true;
                }
                if (
                    typeof item === 'object' &&
                    item !== null &&
                    checkHasDirtyFields(item)
                ) {
                    return true;
                }
            }
        } else if (typeof value === 'object' && value !== null) {
            return checkHasDirtyFields(value);
        }
        return false;
    });
};
