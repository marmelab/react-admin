import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import ListPaginationContext, {
    ListPaginationContextValue,
} from './ListPaginationContext';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Must be used within a <ListContextProvider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @typedef {Object} ListPaginationContextValue
 * @prop {integer}  total the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23
 * @prop {integer}  page the current page. Starts at 1
 * @prop {Function} setPage a callback to change the page, e.g. setPage(3)
 * @prop {integer}  perPage the number of results per page. Defaults to 25
 * @prop {Function} setPerPage a callback to change the number of results per page, e.g. setPerPage(25)
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @returns {ListPaginationContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
const useListPaginationContext = (props?: any): ListPaginationContextValue => {
    const context = useContext(ListPaginationContext);
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractListPaginationContextProps(props) : {},
                context
            ),
        [context, props]
    );
};

/**
 * Extract only the list controller props
 *
 * @param {Object} props Props passed to the useListContext hook
 *
 * @returns {ListControllerResult} List controller props
 */
const extractListPaginationContextProps = ({
    loading,
    page,
    perPage,
    setPage,
    setPerPage,
    total,
    resource,
}) => ({
    loading,
    page,
    perPage,
    setPage,
    setPerPage,
    total,
    resource,
});

export default useListPaginationContext;
