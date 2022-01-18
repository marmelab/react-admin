import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { RaRecord, SortPayload, Identifier } from '../../types';
import { useGetList, useGetManyAggregate } from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';
import { useResourceContext } from '../../core';
import { usePaginationState, useSortState } from '..';
import { ListControllerResult } from '../list';
import { removeEmpty, useSafeSetState } from '../../util';
import { ReferenceArrayInputContextValue } from './ReferenceArrayInputContext';

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
): UseReferenceArrayInputControllerHookValue<RecordType> => {
    const {
        filter: defaultFilter,
        filterToQuery = defaultFilterToQuery,
        field,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        sort: initialSort = { field: 'id', order: 'DESC' },
        options = {},
        reference,
        enableGetChoices,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

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
        ids: field.value || EmptyArray,
    });

    /**
     * Get the possible values to display as choices (with getList)
     */

    // pagination logic
    const {
        page,
        setPage,
        perPage,
        setPerPage,
        pagination,
        setPagination,
    } = usePaginationState({
        page: initialPage,
        perPage: initialPerPage,
    });

    const { setValue } = useFormContext();
    const onSelect = useCallback(
        (newIds: Identifier[]) => {
            // This could happen when user unselect all items using the datagrid for instance
            if (newIds.length === 0) {
                setValue(field.name, EmptyArray);
                return;
            }

            const newValue = new Set(field.value);
            newIds.forEach(newId => {
                newValue.add(newId);
            });
            setValue(field.name, Array.from(newValue));
        },
        [setValue, field.value, field.name]
    );

    const onUnselectItems = useCallback(() => {
        setValue(field.name, EmptyArray);
    }, [setValue, field.name]);

    const onToggleItem = useCallback(
        (id: Identifier) => {
            if (field.value.some(selectedId => selectedId === id)) {
                setValue(
                    field.name,
                    field.value.filter(selectedId => selectedId !== id)
                );
            } else {
                setValue(field.name, [...field.value, id]);
            }
        },
        [setValue, field.name, field.value]
    );

    // sort logic
    const sortRef = useRef(initialSort);
    const { sort, setSort: setSortState } = useSortState(initialSort);

    const setSort = useCallback(
        (sort: SortPayload) => {
            setSortState(sort);
            setPage(1);
        },
        [setPage, setSortState]
    );

    // Ensure sort can be updated through props too, not just by using the setSort function
    useEffect(() => {
        if (!isEqual(initialSort, sortRef.current)) {
            setSortState(initialSort);
        }
    }, [setSortState, initialSort]);

    // Ensure pagination can be updated through props too, not just by using the setPagination function
    const paginationRef = useRef({ initialPage, initialPerPage });
    useEffect(() => {
        if (!isEqual({ initialPage, initialPerPage }, paginationRef.current)) {
            setPagination({ page: initialPage, perPage: initialPerPage });
        }
    }, [setPagination, initialPage, initialPerPage]);

    // filter logic
    const [queryFilter, setFilter] = useState('');
    const filterRef = useRef(defaultFilter);
    const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
        [key: string]: boolean;
    }>({});
    const [filterValues, setFilterValues] = useSafeSetState<{
        [key: string]: any;
    }>(defaultFilter);
    const hideFilter = useCallback(
        (filterName: string) => {
            setDisplayedFilters(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
            setFilterValues(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
        },
        [setDisplayedFilters, setFilterValues]
    );
    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            setDisplayedFilters(previousState => ({
                ...previousState,
                [filterName]: true,
            }));
            setFilterValues(previousState => ({
                ...previousState,
                [filterName]: defaultValue,
            }));
        },
        [setDisplayedFilters, setFilterValues]
    );
    const setFilters = useCallback(
        (filters, displayedFilters) => {
            setFilterValues(removeEmpty(filters));
            setDisplayedFilters(displayedFilters);
            setPage(1);
        },
        [setDisplayedFilters, setFilterValues, setPage]
    );

    // handle filter prop change
    useEffect(() => {
        if (!isEqual(defaultFilter, filterRef.current)) {
            filterRef.current = defaultFilter;
            setFilterValues(defaultFilter);
        }
    });

    // Merge the user filters with the default ones
    const finalFilter = useMemo(
        () => ({
            ...defaultFilter,
            ...filterToQuery(queryFilter),
        }),
        [queryFilter, defaultFilter, filterToQuery]
    );

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords
        ? referenceRecords.filter(Boolean)
        : [];

    const isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(finalFilter)
        : true;

    const {
        data: matchingReferences,
        total,
        error: errorGetList,
        isLoading: isLoadingGetList,
        isFetching: isFetchingGetList,
        refetch: refetchGetMatching,
    } = useGetList<RecordType>(
        reference,
        { pagination, sort, filter: finalFilter },
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

    const dataStatus = getDataStatus<RecordType>({
        field,
        matchingReferences: finalMatchingReferences,
        referenceRecords: finalReferenceRecords,
        translate,
    });

    const refetch = useCallback(() => {
        refetchGetMany();
        refetchGetMatching();
    }, [refetchGetMany, refetchGetMatching]);

    return {
        choices: dataStatus.choices,
        sort,
        data: matchingReferences,
        displayedFilters,
        error:
            errorGetMany || errorGetList
                ? translate('ra.input.references.all_missing', {
                      _: 'ra.input.references.all_missing',
                  })
                : undefined,
        filterValues,
        hideFilter,
        isFetching: isFetchingGetMany || isFetchingGetList,
        isLoading: isLoadingGetMany || isLoadingGetList,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        refetch,
        resource,
        selectedIds: field.value || EmptyArray,
        setFilter,
        setFilters,
        setPage,
        setPagination,
        setPerPage,
        setSort,
        showFilter,
        warning: dataStatus.warning,
        total,
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
    filter?: any;
    filterToQuery?: (filter: any) => any;
    field: ControllerRenderProps;
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

export type UseReferenceArrayInputControllerHookValue<
    RecordType extends RaRecord = any
> = ReferenceArrayInputContextValue<RecordType> &
    Omit<ListControllerResult<RecordType>, 'setSort' | 'refetch'> & {
        refetch: () => void;
    };

const defaultFilterToQuery = searchText => ({ q: searchText });
