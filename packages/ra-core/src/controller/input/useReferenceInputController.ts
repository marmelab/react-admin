import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { keepPreviousData, type UseQueryOptions } from '@tanstack/react-query';

import { useGetList } from '../../dataProvider';
import { useReference } from '../useReference';
import { useReferenceParams } from './useReferenceParams';
import { useWrappedSource } from '../../core';
import type {
    FilterPayload,
    GetListResult,
    RaRecord,
    SortPayload,
} from '../../types';
import type { ChoicesContextValue } from '../../form';

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
 * The hook also allow to filter results. It returns a `setFilters`
 * function. It uses the value to create a filter for the query.
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
 * });
 */
export const useReferenceInputController = <RecordType extends RaRecord = any>(
    props: UseReferenceInputControllerParams<RecordType>
): ChoicesContextValue<RecordType> => {
    const {
        debounce,
        enableGetChoices,
        filter,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        sort: initialSort,
        queryOptions = {},
        reference,
        source,
    } = props;
    const { meta, ...otherQueryOptions } = queryOptions;

    const [params, paramsModifiers] = useReferenceParams({
        resource: reference,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort,
        debounce,
        filter,
    });

    // selection logic
    const finalSource = useWrappedSource(source);
    const currentValue = useWatch({ name: finalSource });

    const isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(params.filterValues)
        : true;

    // fetch possible values
    const {
        data: possibleValuesData,
        total,
        pageInfo,
        isFetching: isFetchingPossibleValues,
        isLoading: isLoadingPossibleValues,
        isPaused: isPausedPossibleValues,
        isPending: isPendingPossibleValues,
        isPlaceholderData: isPlaceholderDataPossibleValues,
        error: errorPossibleValues,
        refetch: refetchGetList,
    } = useGetList<RecordType>(
        reference,
        {
            pagination: {
                page: params.page,
                perPage: params.perPage,
            },
            sort: { field: params.sort, order: params.order },
            filter: { ...params.filter, ...filter },
            meta,
        },
        {
            enabled: isGetMatchingEnabled,
            placeholderData: keepPreviousData,
            ...(otherQueryOptions as UseQueryOptions<
                GetListResult<RecordType>
            >),
        }
    );

    // fetch current value
    const {
        referenceRecord: currentReferenceRecord,
        refetch: refetchReference,
        error: errorReference,
        isLoading: isLoadingReference,
        isFetching: isFetchingReference,
        isPaused: isPausedReference,
        isPending: isPendingReference,
        isPlaceholderData: isPlaceholderDataReference,
    } = useReference<RecordType>({
        id: currentValue,
        reference,
        // @ts-ignore the types of the queryOptions for the getMAny and getList are not compatible
        options: {
            enabled: currentValue != null && currentValue !== '',
            meta,
            ...otherQueryOptions,
        },
    });

    const isPending =
        // The reference query isn't enabled when there is no value yet but as it has no data, react-query will flag it as pending
        (currentValue != null && currentValue !== '' && isPendingReference) ||
        isPendingPossibleValues;

    const isPaused = isPausedReference || isPausedPossibleValues;

    // We need to delay the update of the referenceRecord and the finalData
    // to the next React state update, because otherwise it can raise a warning
    // with AutocompleteInput saying the current value is not in the list of choices
    const [referenceRecord, setReferenceRecord] = useState<
        RecordType | undefined
    >(undefined);
    useEffect(() => {
        setReferenceRecord(currentReferenceRecord);
    }, [currentReferenceRecord]);

    // add current value to possible sources
    const { finalData, finalTotal } = useMemo(() => {
        if (isPaused && possibleValuesData == null && referenceRecord == null) {
            return {
                finalData: null,
                finalTotal: null,
            };
        }
        if (
            referenceRecord == null ||
            possibleValuesData == null ||
            (possibleValuesData ?? []).find(
                record => record.id === referenceRecord.id
            )
        ) {
            // Here we might have the referenceRecord but no data (because of enableGetChoices for instance)
            const finalData = possibleValuesData ?? [];
            if (
                referenceRecord &&
                finalData.find(r => r.id === referenceRecord.id) == null
            ) {
                finalData.push(referenceRecord);
            }

            return {
                finalData,
                finalTotal: total ?? finalData.length,
            };
        } else {
            return {
                finalData: [referenceRecord, ...(possibleValuesData ?? [])],
                finalTotal: total == null ? undefined : total + 1,
            };
        }
    }, [isPaused, referenceRecord, possibleValuesData, total]);

    const refetch = useCallback(() => {
        refetchGetList();
        refetchReference();
    }, [refetchGetList, refetchReference]);

    const currentSort = useMemo(
        () => ({
            field: params.sort,
            order: params.order,
        }),
        [params.sort, params.order]
    );
    return useMemo(
        () =>
            ({
                sort: currentSort,
                // TODO v6: we shouldn't return a default empty array. This is actually enforced at the type level in other hooks such as useListController
                allChoices: finalData ?? [],
                // TODO v6: same as above
                availableChoices: possibleValuesData ?? [],
                // TODO v6: same as above
                selectedChoices: referenceRecord ? [referenceRecord] : [],
                displayedFilters: params.displayedFilters,
                error: errorReference || errorPossibleValues,
                filter: params.filter,
                filterValues: params.filterValues,
                hideFilter: paramsModifiers.hideFilter,
                isFetching: isFetchingReference || isFetchingPossibleValues,
                isLoading: isLoadingReference || isLoadingPossibleValues,
                isPaused: isPausedReference || isPausedPossibleValues,
                isPending,
                isPlaceholderData:
                    isPlaceholderDataReference ||
                    isPlaceholderDataPossibleValues,
                page: params.page,
                perPage: params.perPage,
                refetch,
                resource: reference,
                setFilters: paramsModifiers.setFilters,
                setPage: paramsModifiers.setPage,
                setPerPage: paramsModifiers.setPerPage,
                setSort: paramsModifiers.setSort,
                showFilter: paramsModifiers.showFilter,
                // we return source and not finalSource because child inputs (e.g. AutocompleteInput) already call useInput and compute the final source
                source,
                total: finalTotal,
                hasNextPage: pageInfo
                    ? pageInfo.hasNextPage
                    : total != null
                      ? params.page * params.perPage < total
                      : undefined,
                hasPreviousPage: pageInfo
                    ? pageInfo.hasPreviousPage
                    : params.page > 1,
                isFromReference: true,
            }) as ChoicesContextValue<RecordType>,
        [
            currentSort,
            errorPossibleValues,
            errorReference,
            finalData,
            finalTotal,
            isFetchingPossibleValues,
            isFetchingReference,
            isLoadingPossibleValues,
            isLoadingReference,
            isPausedPossibleValues,
            isPausedReference,
            isPending,
            isPlaceholderDataReference,
            isPlaceholderDataPossibleValues,
            pageInfo,
            params.displayedFilters,
            params.filter,
            params.filterValues,
            params.page,
            params.perPage,
            paramsModifiers.hideFilter,
            paramsModifiers.setFilters,
            paramsModifiers.setPage,
            paramsModifiers.setPerPage,
            paramsModifiers.setSort,
            paramsModifiers.showFilter,
            possibleValuesData,
            reference,
            referenceRecord,
            refetch,
            source,
            total,
        ]
    );
};

export interface UseReferenceInputControllerParams<
    RecordType extends RaRecord = any,
> {
    debounce?: number;
    filter?: FilterPayload;
    queryOptions?: Omit<
        UseQueryOptions<
            | GetListResult<RecordType>
            // useReference calls getManyAggregate, which returns a an array of records
            | RecordType[]
        >,
        'queryFn' | 'queryKey'
    > & { meta?: any };
    page?: number;
    perPage?: number;
    record?: RaRecord;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source: string;
    enableGetChoices?: (filters: any) => boolean;
}
