import { useMemo, useState } from 'react';

import { Record, Pagination, Sort } from '../../types';
import { useGetMany } from '../../dataProvider';
import { FieldInputProps } from 'react-final-form';
import useGetMatching from '../../dataProvider/useGetMatching';
import { useTranslate } from '../../i18n';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';

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
    filterToQuery = searchText => ({ q: searchText }),
    input,
    perPage = 25,
    sort: defaultSort = { field: 'id', order: 'DESC' },
    options,
    reference,
    resource,
    source,
}: Option): ReferenceArrayInputProps => {
    const translate = useTranslate();

    const [pagination, setPagination] = useState({ page: 1, perPage });
    const [sort, setSort] = useState(defaultSort);
    const [filter, setFilter] = useState('');

    const { data: referenceRecords, loaded } = useGetMany(
        reference,
        input.value || []
    );

    const finalFilter = useMemo(
        () => ({
            ...defaultFilter,
            ...filterToQuery(filter),
        }),
        [defaultFilter, filter, filterToQuery]
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

    const finalReferenceRecords = referenceRecords.filter(
        item => item != undefined
    );

    const finalMatchingReferences =
        matchingReferences && matchingReferences.length > 0
            ? (matchingReferences || []).concat(finalReferenceRecords)
            : finalReferenceRecords.length > 0
            ? finalReferenceRecords
            : undefined;

    const dataStatus = getDataStatus({
        input,
        // We merge the currently selected records with the matching ones, otherwise
        // the component displaying the currently selected records may fail
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
