import { useContext } from 'react';
import { SimpleFormIteratorItemContext } from './SimpleFormIteratorItemContext';

/**
 * A hook that provides access to a SimpleFormIterator item meta (its index and the total number of items) and mutators (reorder and remove this remove).
 * Useful to create custom array input iterators.
 * @see {SimpleFormIterator}
 * @see {ArrayInput}
 */
export const useSimpleFormIteratorItem = () =>
    useContext(SimpleFormIteratorItemContext);
