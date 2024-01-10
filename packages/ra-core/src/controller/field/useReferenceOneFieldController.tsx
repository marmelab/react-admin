import get from 'lodash/get';
import { UseQueryOptions } from 'react-query';

import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../notification';
import { RaRecord, SortPayload } from '../../types';
import { UseReferenceResult } from '../useReference';

export interface UseReferenceOneFieldControllerParams<
    RecordType extends RaRecord = any
> {
    record?: RaRecord;
    reference: string;
    source?: string;
    target: string;
    sort?: SortPayload;
    filter?: any;
    queryOptions?: UseQueryOptions<{
        data: RecordType[];
        total: number;
    }> & { meta?: any };
}

/**
 * Fetch a reference record in a one-to-one relationship, and return it when available
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { data, isLoading, error } = useReferenceOneFieldController({
 *     record: { id: 7, name: 'James Joyce'}
 *     reference: 'bios',
 *     target: 'author_id',
 * });
 *
 * @typedef {Object} UseReferenceOneFieldControllerParams
 * @prop {Object} props.record The current resource record
 * @prop {string} props.reference The linked resource name
 * @prop {string} props.target The target resource key
 * @prop {string} props.source The key current record identifier ('id' by default)
 * @prop {Object} props.sort The sort to apply to the referenced records
 * @prop {Object} props.filter The filter to apply to the referenced records
 * @returns {UseReferenceResult} The request state. Destructure as { referenceRecord, isLoading, error }.
 */
export const useReferenceOneFieldController = <
    RecordType extends RaRecord = any
>(
    props: UseReferenceOneFieldControllerParams<RecordType>
): UseReferenceResult<RecordType> => {
    const {
        reference,
        record,
        target,
        source = 'id',
        sort = { field: 'id', order: 'ASC' },
        filter = {},
        queryOptions = {},
    } = props;
    const notify = useNotify();
    const { meta, ...otherQueryOptions } = queryOptions;

    const { data, error, isFetching, isLoading, refetch } = useGetManyReference<
        RecordType
    >(
        reference,
        {
            target,
            id: get(record, source),
            pagination: { page: 1, perPage: 1 },
            sort,
            filter,
            meta,
        },
        {
            enabled: !!record,
            onError: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'error',
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
            ...otherQueryOptions,
        }
    );

    return {
        referenceRecord: data ? data[0] : undefined,
        error,
        isFetching,
        isLoading,
        refetch,
    };
};
