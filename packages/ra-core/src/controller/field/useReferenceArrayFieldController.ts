import { useMemo } from 'react';
import get from 'lodash/get';

import { Record, RecordMap, Identifier } from '../../types';
import { useGetMany } from '../../dataProvider';

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
interface ReferenceArrayProps {
    ids: Identifier[];
    data: RecordMap;
    error?: any;
    loading: boolean;
    loaded: boolean;
    referenceBasePath: string;
}

interface Option {
    basePath: string;
    record?: Record;
    reference: string;
    resource: string;
    source: string;
}

/**
 * Hook that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * @example
 *
 * const { ids, data, error, loaded, loading, referenceBasePath } = useReferenceArrayFieldController({
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
 * @returns {ReferenceArrayProps} The reference props
 */
const useReferenceArrayFieldController = ({
    resource,
    reference,
    basePath,
    record,
    source,
}: Option): ReferenceArrayProps => {
    const ids = get(record, source) || [];
    const { data, error, loading, loaded } = useGetMany(reference, ids);
    const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
    return {
        ids,
        data: useMemo(() => indexById(data), [data]),
        error,
        loaded,
        loading,
        referenceBasePath,
    };
};

const indexById = (records: Record[] = []) =>
    records
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, current) => {
            prev[current.id] = current;
            return prev;
        }, {});

export default useReferenceArrayFieldController;
