import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { ListControllerProps } from './useListController';

/**
 * Context to store the filter part of the useListController() result.
 *
 * Use the useListFilterContext() hook to read the context. That's what many
 * List components do in react-admin (e.g. <FilterForm>, <FilterListItem>).
 *
 * @typedef {Object} ListFilterContextValue
 * @prop {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @prop {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @prop {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @prop {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @prop {Function} hideFilter a callback to hide one of the filters, e.g. hideFilter('title')
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @typedef Props
 * @prop {ListFilterContextValue} value
 *
 * @param {Props}
 *
 * @see useListController
 * @see useListFilterContext
 *
 * @example
 *
 * import { useListController, usePickFilterContext, ListFilterContext } from 'ra-core';
 *
 * const List = props => {
 *     const controllerProps = useListController(props);
 *     return (
 *         <ListFilterContext.Provider value={usePickFilterContext(controllerProps)}>
 *             ...
 *         </ListFilterContext.Provider>
 *     );
 * };
 */
const ListFilterContext = createContext<ListFilterContextValue>({
    displayedFilters: null,
    filterValues: null,
    hideFilter: null,
    setFilters: null,
    showFilter: null,
    resource: null,
});

export type ListFilterContextValue = Pick<
    ListControllerProps,
    | 'displayedFilters'
    | 'filterValues'
    | 'hideFilter'
    | 'setFilters'
    | 'showFilter'
    | 'resource'
>;

export const usePickFilterContext = (
    context: ListControllerProps
): ListFilterContextValue =>
    useMemo(
        () =>
            pick(context, [
                'displayedFilters',
                'filterValues',
                'hideFilter',
                'setFilters',
                'showFilter',
                'resource',
            ]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            context.displayedFilters,
            context.filterValues,
            context.hideFilter,
            context.setFilters,
            context.showFilter,
        ]
    );

ListFilterContext.displayName = 'ListFilterContext';

export default ListFilterContext;
