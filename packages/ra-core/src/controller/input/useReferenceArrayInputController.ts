import { useMemo, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import {
    PaginationPayload,
    Record,
    SortPayload,
    ReduxState,
} from '../../types';
import { useGetMany } from '../../dataProvider';
import { FieldInputProps } from 'react-final-form';
import useGetMatching from '../../dataProvider/useGetMatching';
import { useTranslate } from '../../i18n';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';
import { useResourceContext } from '../../core';

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
 * @param {Object} option
 * @param {string} option.basePath basepath to current resource
 * @param {Object} option.record The The current resource record
 * @param {string} option.reference The linked resource name
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
const useReferenceArrayInputController = (
    props: Option
): ReferenceArrayInputProps => {
    const {
        filter: defaultFilter,
        filterToQuery = defaultFilterToQuery,
        input,
        perPage = 25,
        sort: defaultSort = { field: 'id', order: 'DESC' },
        options,
        reference,
        source,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    // We store the current input value in a ref so that we are able to fetch
    // only the missing references when the input value changes
    const inputValue = useRef(input.value);
    const [idsToFetch, setIdsToFetch] = useState(input.value);
    const [idsToGetFromStore, setIdsToGetFromStore] = useState([]);
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

    const [pagination, setPagination] = useState({ page: 1, perPage });
    const [sort, setSort] = useState(defaultSort);
    const [filter, setFilter] = useState('');

    // Ensure sort can be updated through props too, not just by using the setSort function
    useEffect(() => {
        if (!isEqual(defaultSort, sort)) {
            setSort(defaultSort);
        }
    }, [setSort, defaultSort, sort]);

    // Ensure pagination can be updated through props too, not just by using the setPagination function
    useEffect(() => {
        const newPagination = {
            page: 1,
            perPage,
        };
        if (!isEqual(newPagination, pagination)) {
            setPagination(newPagination);
        }
    }, [setPagination, perPage, pagination]);

    // Merge the user filters with the default ones
    const finalFilter = useMemo(
        () => ({
            ...defaultFilter,
            ...filterToQuery(filter),
        }),
        [defaultFilter, filter, filterToQuery]
    );

    const { data: referenceRecordsFetched, loaded } = useGetMany(
        reference,
        idsToFetch || []
    );

    const referenceRecords = referenceRecordsFetched
        ? referenceRecordsFetched.concat(referenceRecordsFromStore)
        : referenceRecordsFromStore;

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords.filter(Boolean);

    const { data: matchingReferences } = useGetMatching(
        reference,
        pagination,
        sort,
        finalFilter,
        source,
        resource,
        options
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

    return {
        choices: dataStatus.choices,
        error: dataStatus.error,
        loaded,
        loading: dataStatus.waiting,
        setFilter,
        setPagination,
        setSort,
        warning: dataStatus.warning,
    };
};

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

export default useReferenceArrayInputController;

/**
 * @typedef ReferenceArrayProps
 * @type {Object}
 * @property {Array} ids the list of ids.
 * @property {Object} data Object holding the reference data by their ids
 * @property {Object} error the error returned by the dataProvider
 * @property {boolean} loading is the reference currently loading
 * @property {boolean} loaded has the reference already been loaded
 */
interface ReferenceArrayInputProps {
    choices: Record[];
    error?: any;
    warning?: any;
    loading: boolean;
    loaded: boolean;
    setFilter: (filter: any) => void;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
}

interface Option {
    basePath?: string;
    filter?: any;
    filterToQuery?: (filter: any) => any;
    input: FieldInputProps<any, HTMLElement>;
    options?: any;
    perPage?: number;
    record?: Record;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source: string;
}

const defaultFilterToQuery = searchText => ({ q: searchText });
