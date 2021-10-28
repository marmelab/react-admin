import { createContext } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';

/**
 * A React context that provides access to an ArrayInput mutators and meta as provided by react-hook-form
 * Useful to create custom array input iterators.
 * @see {ArrayInput}
 */
export const ArrayInputContext = createContext<ArrayInputContextValue>(
    undefined
);

export type ArrayInputContextValue = UseFieldArrayReturn;
