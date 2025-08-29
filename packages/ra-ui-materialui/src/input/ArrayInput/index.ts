export * from './ArrayInput';
export * from './SimpleFormIterator';
export * from './SimpleFormIteratorItem';
export * from './useSimpleFormIteratorStyles';
export * from './AddItemButton';
export * from './RemoveItemButton';
export * from './ReOrderButtons';

/**
 * @deprecated Import from `ra-core` or `react-admin` instead
 * FIXME: remove the re-export in v6
 */
export {
    ArrayInputContext,
    useArrayInput,
    useSimpleFormIterator,
    useSimpleFormIteratorItem,
    SimpleFormIteratorContext,
    SimpleFormIteratorItemContext,
} from 'ra-core';
