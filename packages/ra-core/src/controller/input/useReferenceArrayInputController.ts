import { useMemo, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { Record, SortPayload, ReduxState, Identifier } from '../../types';
import { useGetMany } from '../../dataProvider';
import { FieldInputProps, useForm } from 'react-final-form';
import useGetMatching from '../../dataProvider/useGetMatching';
import { useTranslate } from '../../i18n';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';
import { useResourceContext } from '../../core';
import { usePaginationState, useSortState } from '..';
import { ListControllerProps } from '../useListController';
import { indexById, removeEmpty, useSafeSetState } from '../../util';
import { ReferenceArrayInputContextValue } from './ReferenceArrayInputContext';

/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { choices, error, loaded, loading } = useReferenceArrayInputController({
 *      basePath: 'resource';
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} props
 * @param {string} props.basePath basepath to current resource
 * @param {Object} props.record The current resource record
 * @param {string} props.reference The linked resource name
 * @param {string} props.resource The current resource name
 * @param {string} props.source The key of the linked resource identifier
 *
 * @param {Props} props
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
export const useReferenceArrayInputController = (
    props: UseReferenceArrayInputOptions
): ReferenceArrayInputContextValue & Omit<ListControllerProps, 'setSort'> => {
    const {
        filter: defaultFilter,
        filterToQuery = defaultFilterToQuery,
        input,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        sort: initialSort = { field: 'id', order: 'DESC' },
        options,
        reference,
        source,
        enableGetChoices,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    // We store the current input value in a ref so that we are able to fetch
    // only the missing references when the input value changes
    const inputValue = useRef(input.value);
    const [idsToFetch, setIdsToFetch] = useSafeSetState(input.value);
    const [idsToGetFromStore, setIdsToGetFromStore] = useSafeSetState(
        EmptyArray
    );
    const referenceRecordsFromStore = useSelector((state: ReduxState) =>
        idsToGetFromStore.map(id => state.admin.resources[reference].data[id])
    );

    // optimization: we fetch selected items only once. When the user selects more items,
    // as we already have the past selected items in the store, we don't fetch them.
    useEffect(() => {
        // Only fetch new ids
        const newIdsToFetch = difference(input.value, inputValue.current);
        // Only get from store ids selected and already fetched
        const newIdsToGetFromStore = difference(input.value, newIdsToFetch);
        /*
            input.value (current)
                +------------------------+
                | ********************** |
                | ********************** |  inputValue.current (old)
                | ********** +-----------------------+
                | ********** | ooooooooo |           |
                | ********** | ooooooooo |           |
                | ********** | ooooooooo |           |
                | ********** | ooooooooo |           |
                +---|--------|------|----+           |
                    |        |      |                |
                    |        |      |                |
                    |        +------|----------------+
                    |               |
            newIdsToFetch    newIdsToGetFromStore
        */
        // Change states each time input values changes to avoid keeping previous values no more selected
        if (!isEqual(idsToFetch, newIdsToFetch)) {
            setIdsToFetch(newIdsToFetch);
        }
        if (!isEqual(idsToGetFromStore, newIdsToGetFromStore)) {
            setIdsToGetFromStore(newIdsToGetFromStore);
        }

        inputValue.current = input.value;
    }, [
        idsToFetch,
        idsToGetFromStore,
        input.value,
        setIdsToFetch,
        setIdsToGetFromStore,
    ]);

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

    const form = useForm();
    const onSelect = useCallback(
        (newIds: Identifier[]) => {
            // This could happen when user unselect all items using the datagrid for instance
            if (newIds.length === 0) {
                form.change(input.name, EmptyArray);
                return;
            }

            const newValue = new Set(input.value);
            newIds.forEach(newId => {
                newValue.add(newId);
            });
            form.change(input.name, Array.from(newValue));
        },
        [form, input.value, input.name]
    );

    const onUnselectItems = useCallback(() => {
        form.change(input.name, EmptyArray);
    }, [form, input.name]);

    const onToggleItem = useCallback(
        (id: Identifier) => {
            if (input.value.some(selectedId => selectedId === id)) {
                form.change(
                    input.name,
                    input.value.filter(selectedId => selectedId !== id)
                );
            } else {
                form.change(input.name, [...input.value, id]);
            }
        },
        [form, input.name, input.value]
    );

    // sort logic
    const sortRef = useRef(initialSort);
    const { sort, setSort } = useSortState(initialSort);

    // ReferenceArrayInput.setSort had a different signature than the one from ListContext.
    // In order to not break backward compatibility, we added this temporary setSortForList in the
    // ReferenceArrayInputContext
    const setSortForList = useCallback(
        (field: string, order: string = 'ASC') => {
            setSort({ field, order });
            setPage(1);
        },
        [setPage, setSort]
    );

    // Ensure sort can be updated through props too, not just by using the setSort function
    useEffect(() => {
        if (!isEqual(initialSort, sortRef.current)) {
            setSort(initialSort);
        }
    }, [setSort, initialSort]);

    // Ensure pagination can be updated through props too, not just by using the setPagination function
    const paginationRef = useRef({ initialPage, initialPerPage });
    useEffect(() => {
        if (!isEqual({ initialPage, initialPerPage }, paginationRef.current)) {
            setPagination({ page: initialPage, perPage: initialPerPage });
        }
    }, [setPagination, initialPage, initialPerPage]);

    // filter logic
    const [queryFilter, setFilter] = useSafeSetState('');
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

    const {
        data: referenceRecordsFetched,
        loaded,
        refetch: refetchGetMany,
    } = useGetMany(reference, idsToFetch || EmptyArray);

    const referenceRecords = referenceRecordsFetched
        ? referenceRecordsFetched.concat(referenceRecordsFromStore)
        : referenceRecordsFromStore;

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords.filter(Boolean);

    const isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(finalFilter)
        : true;
    const {
        data: matchingReferences,
        ids: matchingReferencesIds,
        total,
        refetch: refetchGetMatching,
    } = useGetMatching(
        reference,
        pagination,
        sort,
        finalFilter,
        source,
        resource,
        options
            ? { ...options, enabled: isGetMatchingEnabled }
            : { enabled: isGetMatchingEnabled }
    );

    // We merge the currently selected records with the matching ones, otherwise
    // the component displaying the currently selected records may fail
    const finalMatchingReferences =
        matchingReferences && matchingReferences.length > 0
            ? mergeReferences(matchingReferences, finalReferenceRecords)
            : finalReferenceRecords.length > 0
            ? finalReferenceRecords
            : matchingReferences;

    const dataStatus = getDataStatus({
        input,
        matchingReferences: finalMatchingReferences,
        referenceRecords: finalReferenceRecords,
        translate,
    });

    const refetch = useCallback(() => {
        refetchGetMany();
        refetchGetMatching();
    }, [refetchGetMany, refetchGetMatching]);

    return {
        basePath: props.basePath || `/${resource}`,
        choices: dataStatus.choices,
        currentSort: sort,
        // For the ListContext, we don't want to always display the selected items first.
        // Indeed it wouldn't work well regarding sorting and pagination
        data:
            matchingReferences && matchingReferences.length > 0
                ? indexById(matchingReferences)
                : {},
        displayedFilters,
        error: dataStatus.error,
        filterValues,
        hasCreate: false,
        hideFilter,
        // For the ListContext, we don't want to always display the selected items first.
        // Indeed it wouldn't work well regarding sorting and pagination
        ids: matchingReferencesIds || EmptyArray,
        loaded,
        loading: dataStatus.waiting && isGetMatchingEnabled,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        refetch,
        resource,
        selectedIds: input.value || EmptyArray,
        setFilter,
        setFilters,
        setPage,
        setPagination,
        setPerPage,
        setSort,
        setSortForList,
        showFilter,
        warning: dataStatus.warning,
        total,
    };
};

const EmptyArray = [];

// concatenate and deduplicate two lists of records
const mergeReferences = (ref1: Record[], ref2: Record[]): Record[] => {
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

export interface UseReferenceArrayInputOptions {
    basePath?: string;
    filter?: any;
    filterToQuery?: (filter: any) => any;
    input: FieldInputProps<any, HTMLElement>;
    options?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source: string;
    enableGetChoices?: (filters: any) => boolean;
}

const defaultFilterToQuery = searchText => ({ q: searchText });
