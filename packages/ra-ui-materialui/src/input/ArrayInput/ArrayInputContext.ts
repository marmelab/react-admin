import { createContext } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';

/**
 * A React context that provides access to an ArrayInput methods as provided by react-hook-form
 * Useful to create custom array input iterators.
 * @see {ArrayInput}
 * @see {@link https://react-hook-form.com/docs/usefieldarray}
 */
export const ArrayInputContext = createContext<
    ArrayInputContextValue | undefined
>(undefined);

export type ArrayInputContextValue = UseFieldArrayReturn;
