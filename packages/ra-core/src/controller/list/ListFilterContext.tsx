import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { ListControllerResult } from './useListController';

/**
 * Context to store the filter part of the useListController() result.
 *
 * Use the useListFilterContext() hook to read the context. That's what many
 * List components do in react-admin (e.g. <FilterForm>, <FilterListItem>).
 *
 * @param {Object}   Props
 * @param {Object}   ListFilterContextValue
 * @param {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @param {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @param {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @param {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @param {Function} hideFilter a callback to hide one of the filters, e.g. hideFilter('title')
 * @param {string}   resource the resource name, deduced from the location. e.g. 'posts'
 * @param {ListFilterContextValue} value
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
export const ListFilterContext = createContext<ListFilterContextValue>({
    displayedFilters: null,
    filterValues: null,
    hideFilter: null,
    setFilters: null,
    showFilter: null,
    resource: null,
});

export type ListFilterContextValue = Pick<
    ListControllerResult,
    | 'displayedFilters'
    | 'filterValues'
    | 'hideFilter'
    | 'setFilters'
    | 'showFilter'
    | 'resource'
>;

export const usePickFilterContext = (
    context: ListControllerResult
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
