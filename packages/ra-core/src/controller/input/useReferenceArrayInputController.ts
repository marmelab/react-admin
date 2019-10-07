import { useMemo, useState, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { Record, Pagination, Sort } from '../../types';
import { useGetMany } from '../../dataProvider';
import { FieldInputProps } from 'react-final-form';
import useGetMatching from '../../dataProvider/useGetMatching';
import { useTranslate } from '../../i18n';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';

/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { choices, error, loaded, loading, referenceBasePath } = useReferenceArrayInputController({
 *      basePath: 'resource';
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} option
 * @param {boolean} option.allowEmpty do we allow for no referenced record (default to false)
 * @param {string} option.basePath basepath to current resource
 * @param {string | false} option.linkType The type of the link toward the referenced record. edit, show of false for no link (default to edit)
 * @param {Object} option.record The The current resource record
 * @param {string} option.reference The linked resource name
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
const useReferenceArrayInputController = ({
    basePath,
    filter: defaultFilter,
    filterToQuery = defaultFilterToQuery,
    input,
    perPage = 25,
    sort: defaultSort = { field: 'id', order: 'DESC' },
    options,
    reference,
    resource,
    source,
}: Option): ReferenceArrayInputProps => {
    const translate = useTranslate();

    // We store the current input value in a ref so that we are able to fetch
    // only the missing references when the input value changes
    const inputValue = useRef(input.value);
    const [idsToFetch, setIdsToFetch] = useState(input.value);

    useEffect(() => {
        const newIdsToFetch = difference(input.value, inputValue.current);

        if (newIdsToFetch.length > 0) {
            setIdsToFetch(newIdsToFetch);
        }
        inputValue.current = input.value;
    }, [input.value, setIdsToFetch]);

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

    const { data: referenceRecords, loaded } = useGetMany(
        reference,
        idsToFetch || []
    );

    const { data: matchingReferences } = useGetMatching(
        reference,
        pagination,
        sort,
        finalFilter,
        source,
        resource,
        options
    );

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords
        ? referenceRecords.filter(Boolean)
        : [];

    // We merge the currently selected records with the matching ones, otherwise
    // the component displaying the currently selected records may fail
    const finalMatchingReferences =
        matchingReferences && matchingReferences.length > 0
            ? matchingReferences.concat(finalReferenceRecords)
            : finalReferenceRecords.length > 0
            ? finalReferenceRecords
            : matchingReferences;

    const dataStatus = getDataStatus({
        input,
        matchingReferences: finalMatchingReferences,
        referenceRecords: finalReferenceRecords,
        translate,
    });

    const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
    return {
        choices: dataStatus.choices,
        error: dataStatus.error,
        loaded,
        loading: dataStatus.waiting,
        referenceBasePath,
        setFilter,
        setPagination,
        setSort,
        warning: dataStatus.warning,
    };
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
 * @property {string} referenceBasePath basePath of the reference
 */
interface ReferenceArrayInputProps {
    choices: Record[];
    error?: any;
    warning?: any;
    loading: boolean;
    loaded: boolean;
    referenceBasePath: string;
    setFilter: (filter: any) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
}

interface Option {
    basePath: string;
    filter?: any;
    filterToQuery?: (filter: any) => any;
    input: FieldInputProps<any, HTMLElement>;
    options?: any;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
}

const defaultFilterToQuery = searchText => ({ q: searchText });
