import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { FilterPayload, RaRecord, SortPayload } from '../../types';
import { useGetList, useGetManyAggregate } from '../../dataProvider';
import { useReferenceParams } from './useReferenceParams';
import { ChoicesContextValue } from '../../form';

/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { choices, error, loaded, loading } = useReferenceArrayInputController({
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} props
 * @param {Object} props.record The current resource record
 * @param {string} props.reference The linked resource name
 * @param {string} props.resource The current resource name
 * @param {string} props.source The key of the linked resource identifier
 *
 * @param {Props} props
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
export const useReferenceArrayInputController = <
    RecordType extends RaRecord = any
>(
    props: UseReferenceArrayInputParams<RecordType>
): ChoicesContextValue<RecordType> => {
    const {
        debounce,
        enableGetChoices,
        filter,
        filterDefaultValues,
        perPage: initialPerPage = 25,
        sort: initialSort = { field: 'id', order: 'DESC' },
        options = {},
        reference,
        source,
    } = props;
    const value = useWatch({ name: source });

    /**
     * Get the records related to the current value (with getMany)
     */
    const {
        data: referenceRecords,
        error: errorGetMany,
        isLoading: isLoadingGetMany,
        isFetching: isFetchingGetMany,
        refetch: refetchGetMany,
    } = useGetManyAggregate<RecordType>(reference, {
        ids: value || EmptyArray,
    });

    const [params, paramsModifiers] = useReferenceParams({
        resource: reference,
        perPage: initialPerPage,
        sort: initialSort,
        debounce,
        filterDefaultValues,
    });

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords
        ? referenceRecords.filter(Boolean)
        : [];

    const isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(params.filterValues)
        : true;

    const {
        data: matchingReferences,
        total,
        pageInfo,
        error: errorGetList,
        isLoading: isLoadingGetList,
        isFetching: isFetchingGetList,
        refetch: refetchGetMatching,
    } = useGetList<RecordType>(
        reference,
        {
            pagination: {
                page: params.page,
                perPage: params.perPage,
            },
            sort: { field: params.sort, order: params.order },
            filter: { ...params.filter, ...filter },
        },
        { retry: false, enabled: isGetMatchingEnabled, ...options }
    );

    // We merge the currently selected records with the matching ones, otherwise
    // the component displaying the currently selected records may fail
    const finalMatchingReferences =
        matchingReferences && matchingReferences.length > 0
            ? mergeReferences(matchingReferences, finalReferenceRecords)
            : finalReferenceRecords.length > 0
            ? finalReferenceRecords
            : matchingReferences;

    const refetch = useCallback(() => {
        refetchGetMany();
        refetchGetMatching();
    }, [refetchGetMany, refetchGetMatching]);

    const currentSort = useMemo(
        () => ({
            field: params.sort,
            order: params.order,
        }),
        [params.sort, params.order]
    );
    return {
        sort: currentSort,
        data: finalMatchingReferences,
        displayedFilters: params.displayedFilters,
        error: errorGetMany || errorGetList,
        filter,
        filterValues: params.filterValues,
        hideFilter: paramsModifiers.hideFilter,
        isFetching: isFetchingGetMany || isFetchingGetList,
        isLoading: isLoadingGetMany || isLoadingGetList,
        page: params.page,
        perPage: params.perPage,
        refetch,
        resource: reference,
        setFilters: paramsModifiers.setFilters,
        setPage: paramsModifiers.setPage,
        setPerPage: paramsModifiers.setPerPage,
        setSort: paramsModifiers.setSort,
        showFilter: paramsModifiers.showFilter,
        source,
        total: total,
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
            ? params.page * params.perPage < total
            : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : params.page > 1,
    };
};

const EmptyArray = [];

// concatenate and deduplicate two lists of records
const mergeReferences = <RecordType extends RaRecord = any>(
    ref1: RecordType[],
    ref2: RecordType[]
): RecordType[] => {
    const res = [...ref1];
    const ids = ref1.map(ref => ref.id);
    ref2.forEach(ref => {
        if (!ids.includes(ref.id)) {
            ids.push(ref.id);
            res.push(ref);
        }
    });
    return res;
};

export interface UseReferenceArrayInputParams<
    RecordType extends RaRecord = any
> {
    debounce?: number;
    filter?: FilterPayload;
    filterDefaultValues?: any;
    options?: any;
    page?: number;
    perPage?: number;
    record?: RecordType;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source: string;
    enableGetChoices?: (filters: any) => boolean;
}
