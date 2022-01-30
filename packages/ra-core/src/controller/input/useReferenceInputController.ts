import { useCallback } from 'react';

import { useGetList, UseGetManyHookValue } from '../../dataProvider';
import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import { useTranslate } from '../../i18n';
import { PaginationPayload, RaRecord, SortPayload } from '../../types';
import { ListControllerResult } from '../list';
import { useReference } from '../useReference';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import useFilterState from '../useFilterState';
import { useRecordSelection } from '../useRecordSelection';
import { useResourceContext } from '../../core';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;
const defaultFilter = {};

/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), it returns the possible choices
 * as the `choices` attribute.
 *
 * @example
 * const {
 *      choices, // the available reference resource
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 * });
 *
 * The hook also allow to filter results. It returns a `setFilter`
 * function. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function option
 * You can also add a permanentFilter to further filter the result:
 *
 * @example
 * const {
 *      choices, // the available reference resource
 *      setFilter,
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 *      permanentFilter: {
 *          author: 'john'
 *      },
 *      filterToQuery: searchText => ({ title: searchText })
 * });
 */
export const useReferenceInputController = <RecordType extends RaRecord = any>(
    props: UseReferenceInputControllerParams
): ReferenceInputValue<RecordType> => {
    const {
        field,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        filter = defaultFilter,
        reference,
        filterToQuery,
        sort: sortOverride,
        enableGetChoices,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    // pagination logic
    const {
        pagination,
        setPagination,
        page,
        setPage,
        perPage,
        setPerPage,
    } = usePaginationState({ page: initialPage, perPage: initialPerPage });

    // sort logic
    const { sort, setSort: setSortState } = useSortState(sortOverride);
    const setSort = useCallback(
        (sort: SortPayload) => {
            setSortState(sort);
            setPage(1);
        },
        [setPage, setSortState]
    );

    // filter logic
    const { filter: filterValues, setFilter } = useFilterState({
        permanentFilter: filter,
        filterToQuery,
    });
    const displayedFilters = [];
    // plus showFilter and hideFilter defined outside of the hook because
    // they never change

    // selection logic
    const [selectedIds, selectionModifiers] = useRecordSelection(reference);

    // fetch possible values
    const {
        data: possibleValuesData = [],
        total,
        pageInfo,
        isFetching: possibleValuesFetching,
        isLoading: possibleValuesLoading,
        error: possibleValuesError,
        refetch: refetchGetList,
    } = useGetList<RecordType>(
        reference,
        { pagination, sort, filter: filterValues },
        { enabled: enableGetChoices ? enableGetChoices(filterValues) : true }
    );

    // fetch current value
    const {
        referenceRecord,
        refetch: refetchReference,
        error: referenceError,
        isLoading: referenceLoading,
        isFetching: referenceFetching,
    } = useReference<RecordType>({
        id: field.value,
        reference,
    });
    // add current value to possible sources
    let finalData: RecordType[], finalTotal: number;
    if (
        !referenceRecord ||
        possibleValuesData.find(record => record.id === field.value)
    ) {
        finalData = possibleValuesData;
        finalTotal = total;
    } else {
        finalData = [referenceRecord, ...possibleValuesData];
        finalTotal = total == null ? undefined : total + 1;
    }

    // overall status
    const dataStatus = getDataStatus({
        field,
        matchingReferences: finalData,
        referenceRecord,
        translate,
    });

    const refetch = useCallback(() => {
        refetchGetList();
        refetchReference();
    }, [refetchGetList, refetchReference]);

    return {
        // should match the ListContext shape
        possibleValues: {
            data: finalData,
            total: finalTotal,
            error: possibleValuesError,
            isFetching: possibleValuesFetching,
            isLoading: possibleValuesLoading,
            page,
            setPage,
            perPage,
            setPerPage,
            hasNextPage: pageInfo
                ? pageInfo.hasNextPage
                : finalTotal != null
                ? page * perPage < finalTotal
                : undefined,
            hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : page > 1,
            sort,
            setSort,
            filterValues,
            displayedFilters,
            setFilters: setFilter,
            showFilter,
            hideFilter,
            selectedIds,
            onSelect: selectionModifiers.select,
            onToggleItem: selectionModifiers.toggle,
            onUnselectItems: selectionModifiers.clearSelection,
            refetch: refetchGetList,
            resource,
        },
        referenceRecord: {
            data: referenceRecord,
            isLoading: referenceLoading,
            isFetching: referenceFetching,
            error: referenceError,
            refetch: refetchReference,
        },
        dataStatus: {
            error: dataStatus.error,
            loading: dataStatus.waiting,
            warning: dataStatus.warning,
        },
        choices: finalData,
        // kept for backwards compatibility
        // @deprecated to be removed in 4.0
        error: dataStatus.error,
        isFetching: possibleValuesFetching || referenceFetching,
        isLoading: possibleValuesLoading || referenceLoading,
        filter: filterValues,
        refetch,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort,
        warning: dataStatus.warning,
    };
};

const hideFilter = () => {};
const showFilter = () => {};

export interface ReferenceInputValue<RecordType extends RaRecord = any> {
    possibleValues: ListControllerResult<RecordType>;
    referenceRecord: {
        data?: RaRecord;
        isLoading: boolean;
        isFetching: boolean;
        error?: any;
        refetch: UseGetManyHookValue<RecordType>['refetch'];
    };
    dataStatus: {
        error?: any;
        loading: boolean;
        warning?: string;
    };
    choices: RecordType[];
    error?: string;
    isFetching: boolean;
    isLoading: boolean;
    pagination: PaginationPayload;
    setFilter: (filter: string) => void;
    filter: any;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    sort: SortPayload;
    warning?: string;
    refetch: () => void;
}

export interface UseReferenceInputControllerParams {
    allowEmpty?: boolean;
    filter?: any;
    filterToQuery?: (filter: string) => any;
    field?: any;
    page?: number;
    perPage?: number;
    record?: RaRecord;
    reference: string;
    // @deprecated ignored
    referenceSource?: typeof defaultReferenceSource;
    resource?: string;
    sort?: SortPayload;
    source: string;
    enableGetChoices?: (filters: any) => boolean;
}
