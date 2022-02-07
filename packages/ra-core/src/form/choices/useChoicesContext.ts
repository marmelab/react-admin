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
    const { data, ...list } = useList<ChoicesType>({ data: options.choices });
    const result = useMemo(
        () => ({
            ...list,
            allChoices: data,
            availableChoices: options.availableChoices ?? data,
            selectedChoices: options.selectedChoices ?? data,
            displayedFilters: options.displayedFilters ?? list.displayedFilters,
            error: options.error ?? list.error,
            filter: options.filter ?? list.filter,
            filterValues: options.filterValues ?? list.filterValues,
            hasNextPage: options.hasNextPage ?? list.hasNextPage,
            hasPreviousPage: options.hasPreviousPage ?? list.hasPreviousPage,
            hideFilter: options.hideFilter ?? list.hideFilter,
            isFetching: options.isFetching ?? list.isFetching,
            isLoading: options.isLoading ?? list.isLoading,
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
        }),
        [data, list, options]
    );
    if (!context || options.choices) {
        return result;
    }

    return context;
};
