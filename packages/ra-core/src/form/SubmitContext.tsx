import { createContext } from 'react';
import { SubmitHandler, FieldValues } from 'react-hook-form';

/**
 * Context to store the result of form submit related props.
 *
 * Use the useSubmitContext() hook to read the context.
 */
export const SubmitContext = createContext<SubmitContextValue>({
    onSubmit: null,
    sanitizeEmptyValues: null,
});

export interface SubmitContextValue {
    onSubmit?: SubmitHandler<FieldValues>;
    sanitizeEmptyValues?: boolean;
}
