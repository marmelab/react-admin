import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { ListFilterContext, ListFilterContextValue } from './ListFilterContext';

/**
 * Hook to read the list props from the ListFilterContext.
 *
 * Must be used within a <ListFilterContextProvider>.
 *
 * @typedef {Object} ListFilterContextValue
 * @prop {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @prop {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @prop {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @prop {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @prop {Function} hideFilter a callback to hide one of the filters, e.g. hideFilter('title')
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @returns {ListFilterContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
export const useListFilterContext = (props?: any): ListFilterContextValue => {
    const context = useContext(ListFilterContext);
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

const extractListPaginationContextProps = ({
    displayedFilters,
    filterValues,
    hideFilter,
    setFilters,
    showFilter,
    resource,
}) => ({
    displayedFilters,
    filterValues,
    hideFilter,
    setFilters,
    showFilter,
    resource,
});
