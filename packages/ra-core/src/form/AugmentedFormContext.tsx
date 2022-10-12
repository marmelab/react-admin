import { createContext } from 'react';
import { SubmitHandler, FieldValues } from 'react-hook-form';

/**
 * Context to store the result of the useAugmentedForm() hook.
 *
 * Use the useAugmentedFormContext() hook to read the context.
 */
export const AugmentedFormContext = createContext<AugmentedFormContextValue>({
    onSubmit: null,
    sanitizeEmptyValues: null,
});

export interface AugmentedFormContextValue {
    onSubmit?: SubmitHandler<FieldValues>;
    sanitizeEmptyValues?: boolean;
}
