import { createContext } from 'react';

/**
 * A React context that provides access to a SimpleFormIterator data (the total number of items) and mutators (add, reorder and remove).
 * Useful to create custom array input iterators.
 * @see {SimpleFormIterator}
 * @see {ArrayInput}
 */
export const SimpleFormIteratorContext = createContext<
    SimpleFormIteratorContextValue | undefined
>(undefined);

export type SimpleFormIteratorContextValue = {
    add: () => void;
    remove: (index: number) => void;
    reOrder: (index: number, newIndex: number) => void;
    source: string;
    total: number;
};
