import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useGetList } from '../../dataProvider';
import { FilterPayload, RaRecord, SortPayload } from '../../types';
import { useReference } from '../useReference';
import { ChoicesContextValue } from '../../form';
import { useReferenceParams } from './useReferenceParams';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

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
): ChoicesContextValue<RecordType> => {
    const {
        debounce,
        enableGetChoices,
        filter,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        reference,
        sort: initialSort,
        source,
    } = props;

    const [params, paramsModifiers] = useReferenceParams({
        resource: reference,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort,
        debounce,
    });

    // selection logic
    const currentValue = useWatch({ name: source });

    const isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(params.filterValues)
        : true;

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
        {
            pagination: {
                page: params.page,
                perPage: params.perPage,
            },
            sort: { field: params.sort, order: params.order },
            filter: { ...params.filter, ...filter },
        },
        {
            enabled: isGetMatchingEnabled,
        }
    );

    // fetch current value
    const {
        referenceRecord,
        refetch: refetchReference,
        error: referenceError,
        isLoading: referenceLoading,
        isFetching: referenceFetching,
    } = useReference<RecordType>({
        id: currentValue,
        reference,
    });
    // add current value to possible sources
    let finalData: RecordType[], finalTotal: number;
    if (
        !referenceRecord ||
        possibleValuesData.find(record => record.id === currentValue)
    ) {
        finalData = possibleValuesData;
        finalTotal = total;
    } else {
        finalData = [referenceRecord, ...possibleValuesData];
        finalTotal = total == null ? undefined : total + 1;
    }

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
    return {
        sort: currentSort,
        allChoices: finalData,
        availableChoices: possibleValuesData,
        selectedChoices: [referenceRecord],
        displayedFilters: params.displayedFilters,
        error: referenceError || possibleValuesError,
        filter: params.filter,
        filterValues: params.filterValues,
        hideFilter: paramsModifiers.hideFilter,
        isFetching: referenceFetching || possibleValuesFetching,
        isLoading: referenceLoading || possibleValuesLoading,
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
        total: finalTotal,
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
            ? params.page * params.perPage < total
            : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : params.page > 1,
    };
};

export interface UseReferenceInputControllerParams {
    allowEmpty?: boolean;
    debounce?: number;
    filter?: FilterPayload;
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
