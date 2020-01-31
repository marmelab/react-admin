import get from 'lodash/get';

import { Record, Sort, RecordMap, Identifier } from '../../types';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../sideEffect';

/**
 * @typedef ReferenceManyProps
 * @type {Object}
 * @property {Array} data: the referenced records dictionary by their ids.
 * @property {Array} ids: the list of referenced records ids.
 * @property {boolean} loaded: boolean indicating if the references has already be loaded loaded
 * @property {string | false} referenceBasePath base path of the related record
 * @property {number} total records
 */
interface ReferenceManyProps {
    data: RecordMap;
    ids: Identifier[];
    loaded: boolean;
    loading: boolean;
    referenceBasePath: string;
    total: number;
}

interface Options {
    basePath: string;
    data?: RecordMap;
    filter?: any;
    ids?: any[];
    loaded?: boolean;
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
 * Fetch reference records, and return them when avaliable
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { loaded, referenceRecord, resourceLinkPath } = useReferenceManyFieldController({
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
    const notify = useNotify();
    const { data, ids, total, loading, loaded } = useGetManyReference(
        reference,
        target,
        referenceId,
        { page, perPage },
        sort,
        filter,
        resource,
        {
            onFailure: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning'
                ),
        }
    );

    const referenceBasePath = basePath.replace(resource, reference);

    return {
        data,
        ids,
        loaded,
        loading,
        referenceBasePath,
        total,
    };
};

export default useReferenceManyFieldController;
