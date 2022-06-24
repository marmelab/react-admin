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
        // When not in a ChoicesContext, paginating does not make sense (e.g. AutocompleteInput).
        perPage: Infinity,
    });
    const result = useMemo(
        () => ({
            allChoices: context?.allChoices ?? data,
            availableChoices:
                context?.availableChoices ?? options.availableChoices ?? data,
            selectedChoices:
                context?.selectedChoices ?? options.selectedChoices ?? data,
            displayedFilters:
                context?.displayedFilters ??
                options.displayedFilters ??
                list.displayedFilters,
            error: context?.error ?? options.error ?? list.error,
            filter: context?.filter ?? options.filter ?? list.filter,
            filterValues:
                context?.filterValues ??
                options.filterValues ??
                list.filterValues,
            hasNextPage:
                context?.hasNextPage ?? options.hasNextPage ?? list.hasNextPage,
            hasPreviousPage:
                context?.hasPreviousPage ??
                options.hasPreviousPage ??
                list.hasPreviousPage,
            hideFilter:
                context?.hideFilter ?? options.hideFilter ?? list.hideFilter,
            isFetching:
                context?.isFetching ?? options.isFetching ?? list.isFetching,
            isLoading:
                context?.isLoading ?? options.isLoading ?? list.isLoading,
            page: context?.page ?? options.page ?? list.page,
            perPage: context?.perPage ?? options.perPage ?? list.perPage,
            refetch: context?.refetch ?? options.refetch ?? list.refetch,
            resource: context?.resource ?? options.resource ?? list.resource,
            setFilters:
                context?.setFilters ?? options.setFilters ?? list.setFilters,
            setPage: context?.setPage ?? options.setPage ?? list.setPage,
            setPerPage:
                context?.setPerPage ?? options.setPerPage ?? list.setPerPage,
            setSort: context?.setSort ?? options.setSort ?? list.setSort,
            showFilter:
                context?.showFilter ?? options.showFilter ?? list.showFilter,
            sort: context?.sort ?? options.sort ?? list.sort,
            source: context?.source ?? options.source,
            total: context?.total ?? options.total ?? list.total,
        }),
        [context, data, list, options]
    );

    return result;
};
