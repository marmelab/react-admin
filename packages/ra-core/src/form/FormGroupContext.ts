import { createContext } from 'react';

/**
 * Context allowing inputs to register to a specific group.
 * This enables other components in the group to access group properties such as its
 * validation (valid/invalid) or whether its inputs have been updated (dirty/pristine).
 *
 * This should only be used through a FormGroupContextProvider.
 */
export const FormGroupContext = createContext<FormGroupContextValue | null>(
    null
);

export type FormGroupContextValue = string;
