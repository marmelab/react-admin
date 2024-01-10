import { useContext, useMemo } from 'react';
import { RaRecord } from '../../types';
import { useList } from '../../controller';
import { ChoicesContext, ChoicesContextValue } from './ChoicesContext';

export const useChoicesContext = <ChoicesType extends RaRecord = RaRecord>(
    options: Partial<ChoicesContextValue> & { choices?: ChoicesType[] } = {}
): ChoicesContextValue => {
    const context = useContext(ChoicesContext) as ChoicesContextValue<
        ChoicesType
    >;
    const { data, ...list } = useList<ChoicesType>({
        data: options.choices,
        isLoading: options.isLoading,
        // When not in a ChoicesContext, paginating does not make sense (e.g. AutocompleteInput).
        perPage: Infinity,
    });
    const result = useMemo(() => {
        // Props take precedence over context.
        if (options.choices || !context) {
            return {
                allChoices: data,
                availableChoices: options.availableChoices ?? data,
                selectedChoices: options.selectedChoices ?? data,
                displayedFilters:
                    options.selectedChoices ?? list.displayedFilters,
                error: options.error,
                filter: options.filter ?? list.filter,
                filterValues: options.filterValues ?? list.filterValues,
                hasNextPage: options.hasNextPage ?? list.hasNextPage,
                hasPreviousPage:
                    options.hasPreviousPage ?? list.hasPreviousPage,
                hideFilter: options.hideFilter ?? list.hideFilter,
                isLoading: list.isLoading, // we must take the one for useList, otherwise the loading state isn't synchronized with the data
                isFetching: list.isFetching, // same
                page: options.page ?? list.page,
                perPage: options.perPage ?? list.perPage,
                refetch: options.refetch ?? list.refetch,
                resource: options.resource ?? list.resource,
                setFilters: options.setFilters ?? list.setFilters,
                setPage: options.setPage ?? list.setPage,
                setPerPage: options.setPerPage ?? list.setPerPage,
                setSort: options.setSort ?? list.setSort,
                showFilter: options.showFilter ?? list.showFilter,
                sort: options.sort ?? list.sort,
                source: options.source,
                total: options.total ?? list.total,
                isFromReference: false,
            };
        }
        return context;
    }, [context, data, list, options]);

    return result;
};
