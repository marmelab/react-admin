import get from 'lodash/get';

import { Record, SortPayload } from '../../types';
import { useGetMany } from '../../dataProvider';
import { ListControllerProps } from '../useListController';
import { useNotify } from '../../sideEffect';
import { useResourceContext } from '../../core';
import { useList } from '../useList';

interface Option {
    basePath?: string;
    filter?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source: string;
}

const emptyArray = [];
const defaultFilter = {};
const defaultSort = { field: null, order: null };

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
 * @param {Object} props
 * @param {string} props.basePath basepath to current resource
 * @param {Object} props.record The current resource record
 * @param {string} props.reference The linked resource name
 * @param {string} props.resource The current resource name
 * @param {string} props.source The key of the linked resource identifier
 *
 * @param {Props} props
 *
 * @returns {ReferenceArrayProps} The reference props
 */
const useReferenceArrayFieldController = (
    props: Option
): ListControllerProps => {
    const {
        basePath,
        filter = defaultFilter,
        page = 1,
        perPage = 1000,
        record,
        reference,
        sort = defaultSort,
        source,
    } = props;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const ids = get(record, source) || emptyArray;
    const { data, error, loading, loaded, refetch } = useGetMany(
        reference,
        ids,
        {
            onFailure: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'warning',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                ),
        }
    );

    const listProps = useList({
        data,
        error,
        filter,
        ids,
        loaded,
        loading,
        page,
        perPage,
        sort,
    });

    return {
        basePath: basePath
            ? basePath.replace(resource, reference)
            : `/${reference}`,
        ...listProps,
        defaultTitle: null,
        hasCreate: false,
        refetch,
        resource: reference,
    };
};

export default useReferenceArrayFieldController;
