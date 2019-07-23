import { useEffect, useMemo } from 'react';
// @ts-ignore
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyReference } from '../../actions';
import {
    getIds,
    getReferences,
    getTotal,
    nameRelatedTo,
} from '../../reducer/admin/references/oneToMany';
import { Record, Sort, RecordMap, Identifier } from '../../types';

interface ReferenceManyProps {
    data: RecordMap;
    ids: Identifier[];
    loadedOnce: boolean;
    referenceBasePath: string;
    total: number;
}

interface Options {
    basePath: string;
    data?: RecordMap;
    filter?: any;
    ids?: any[];
    loadedOnce?: boolean;
    page: number;
    perPage: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
    target: string;
    total?: number;
}

const defaultFilter = {};

/**
 * @typedef ReferenceManyProps
 * @type {Object}
 * @property {Object} data: the referenced records dictionary by their ids.
 * @property {Object} ids: the list of referenced records ids.
 * @property {boolean} loadedOnce: boolean indicating if the references has already be loaded loaded
 * @property {string | false} referenceBasePath base path of the related record
 */

/**
 * Fetch reference records, and return them when avaliable
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { isLoading, referenceRecord, resourceLinkPath } = useReferenceManyFieldController({
 *     resource
 *     reference: 'users',
 *     record: {
 *         userId: 7
 *     }
 *     target: 'comments',
 *     source: 'userId',
 *     basePath: '/comments',
 *     page: 1,
 *     perPage: 25,
 * });
 *
 * @param {Object} option
 * @param {string} option.resource The current resource name
 * @param {string} option.reference The linked resource name
 * @param {Object} option.record The current resource record
 * @param {string} option.target The target resource key
 * @param {Object} option.filter The filter applied on the recorded records list
 * @param {string} option.source The key of the linked resource identifier
 * @param {string} option.basePath basepath to current resource
 * @param {number} option.page the page number
 * @param {number} option.perPage the number of item per page
 * @param {object} option.sort the sort to apply to the referenced records
 *
 * @returns {ReferenceManyProps} The reference many props
 */
const useReferenceManyFieldController = ({
    resource,
    reference,
    record,
    target,
    filter = defaultFilter,
    source,
    basePath,
    page,
    perPage,
    sort = { field: 'id', order: 'DESC' },
}: Options): ReferenceManyProps => {
    const referenceId = get(record, source);
    const relatedTo = useMemo(
        () => nameRelatedTo(reference, referenceId, resource, target, filter),
        [filter, reference, referenceId, resource, target]
    );
    const ids = useSelector(selectIds(relatedTo), shallowEqual);
    const data = useSelector(selectData(reference, relatedTo), shallowEqual);
    const total = useSelector(selectTotal(relatedTo));

    const dispatch = useDispatch();

    useEffect(
        fetchReferences({
            reference,
            referenceId,
            target,
            filter,
            source,
            page,
            perPage,
            sort,
            dispatch,
            relatedTo,
        }),
        [
            reference,
            referenceId,
            resource,
            target,
            filter,
            source,
            crudGetManyReference,
            page,
            perPage,
            sort.field,
            sort.order,
        ]
    );

    const referenceBasePath = basePath.replace(resource, reference);

    return {
        data,
        ids,
        loadedOnce: typeof ids !== 'undefined',
        referenceBasePath,
        total,
    };
};

const fetchReferences = ({
    reference,
    referenceId,
    target,
    filter,
    source,
    dispatch,
    page,
    perPage,
    sort,
    relatedTo,
}) => () => {
    dispatch(
        crudGetManyReference(
            reference,
            target,
            referenceId,
            relatedTo,
            { page, perPage },
            sort,
            filter,
            source
        )
    );
};

const selectData = (reference, relatedTo) => state =>
    getReferences(state, reference, relatedTo);

const selectIds = relatedTo => state => getIds(state, relatedTo);
const selectTotal = relatedTo => state => getTotal(state, relatedTo);

export default useReferenceManyFieldController;
