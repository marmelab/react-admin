import { useContext } from 'react';

import ListSortContext, { ListSortContextValue } from './ListSortContext';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Must be used within a <ListContextProvider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @typedef {Object} ListSortContextValue
 * @prop {Object}   currentSort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort('name', 'ASC')
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @returns {ListSortContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
const useListSortContext = (props?: any): ListSortContextValue => {
    const context = useContext(ListSortContext);
    if (!context.setSort) {
        /**
         * The element isn't inside a <ListSortContext.Provider>
         *
         * This may only happen when using Datagrid / SimpleList / SingleFieldList components
         * outside of a List / ReferenceManyField / ReferenceArrayField -
         * which isn't documented but tolerated.
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "List components must be used inside a <ListContextProvider>. Relying on props rather than context to get List data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }
        return props;
    }
    return context;
};

export default useListSortContext;
