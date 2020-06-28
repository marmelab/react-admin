import { useContext } from 'react';

import ListContext from './ListContext';
import { ListControllerProps } from './useListController';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Must be used within a <ListContext.Provider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @see useListController for the list of props
 *
 * @example // custom list view
 *
 * import { useListContext } from 'react-admin';
 *
 * const MyList = () => {
 *     const { data, id, loaded } = useListContext();
 *     if (!loaded) {
 *         return <>Loading...</>;
 *     }
 *     const records = ids.map(id => data[id]);
 *     return (
 *         <ul>
 *             {records.map(record => (
 *                 <li key={record.id}>{record.name}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 *
 * @example // custom pagination
 *
 * import { useListContext } from 'react-admin';
 * import { Button, Toolbar } from '@material-ui/core';
 * import ChevronLeft from '@material-ui/icons/ChevronLeft';
 * import ChevronRight from '@material-ui/icons/ChevronRight';
 *
 * const PrevNextPagination = () => {
 *     const { page, perPage, total, setPage } = useListContext();
 *     const nbPages = Math.ceil(total / perPage) || 1;
 *     return (
 *         nbPages > 1 &&
 *             <Toolbar>
 *                 {page > 1 &&
 *                     <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
 *                         <ChevronLeft />
 *                         Prev
 *                     </Button>
 *                 }
 *                 {page !== nbPages &&
 *                     <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
 *                         Next
 *                         <ChevronRight />
 *                     </Button>
 *                 }
 *             </Toolbar>
 *     );
 * }
 */
const useListContext = (props?: any): ListControllerProps => {
    const context = useContext(ListContext);
    if (!context.resource) {
        /**
         * The element isn't inside a <ListContext.Provider>
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
                "List components must be used inside a <ListContext.Provider>. Relying on props rather than context to get List data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }
        return props;
    }
    return context;
};

export default useListContext;
