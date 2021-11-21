import { useContext } from 'react';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';

/**
 * A hook that provides access to a SimpleFormIterator data (the total number of items) and mutators (add, reorder and remove).
 * Useful to create custom array input iterators.
 * @see {SimpleFormIterator}
 * @see {ArrayInput}
 */
export const useSimpleFormIterator = () =>
    useContext(SimpleFormIteratorContext);
