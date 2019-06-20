import { useEffect } from 'react';
// @ts-ignore
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate } from '../../actions';
import { getReferencesByIds } from '../../reducer/admin/references/oneToMany';
import { ReduxState, Record, RecordMap, Identifier } from '../../types';

interface ReferenceArrayProps {
    loadedOnce: boolean;
    ids: Identifier[];
    data: RecordMap;
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
 * @typedef ReferenceArrayProps
 * @type {Object}
 * @property {boolean} loadedOnce: boolean indicating if the reference has already beeen loaded
 * @property {Array} ids: the list of ids.
 * @property {Object} data: Object holding the reference data by their ids
 * @property {string} referenceBasePath basePath of the reference
 */

/**
 * Hook that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * @example
 *
 * const { loadedOnce, data, ids, referenceBasePath, currentSort } = useReferenceArray({
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
 * @returns {ReferenceProps} The reference props
 */
const useReferenceArray = ({
    resource,
    reference,
    basePath,
    record,
    source,
}: Option): ReferenceArrayProps => {
    const dispatch = useDispatch();
    const { data, ids } = useSelector(
        getReferenceArray({ record, source, reference }),
        shallowEqual
    );
    useEffect(() => {
        dispatch(crudGetManyAccumulate(reference, ids));
    }, [reference, ids, record.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak

    return {
        // eslint-disable-next-line eqeqeq
        loadedOnce: data != undefined,
        ids,
        data,
        referenceBasePath,
    };
};

const getReferenceArray = ({ record, source, reference }) => (
    state: ReduxState
) => {
    const ids = get(record, source) || [];
    return {
        data: getReferencesByIds(state, reference, ids),
        ids,
    };
};

export default useReferenceArray;
