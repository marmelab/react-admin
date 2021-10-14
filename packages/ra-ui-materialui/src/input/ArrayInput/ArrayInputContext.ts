import { createContext } from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';

/**
 * A React context that provides access to an ArrayInput mutators and meta as provided by react-final-form-array
 * Useful to create custom array input iterators.
 * @see {ArrayInput}
 * @see {@link https://github.com/final-form/react-final-form-arrays|react-final-form-array}
 */
export const ArrayInputContext = createContext<ArrayInputContextValue>(
    undefined
);

export type ArrayInputContextValue = FieldArrayRenderProps<any, HTMLElement>;
