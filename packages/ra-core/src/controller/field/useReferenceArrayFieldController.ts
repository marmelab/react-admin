import get from 'lodash/get';
import { RaRecord, SortPayload } from '../../types';
import { useGetManyAggregate } from '../../dataProvider';
import { ListControllerResult, useList } from '../list';
import { useNotify } from '../../notification';
import { UseQueryOptions } from '@tanstack/react-query';

export interface UseReferenceArrayFieldControllerParams<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> {
    filter?: any;
    page?: number;
    perPage?: number;
    record?: RecordType;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source: string;
    queryOptions?: Omit<
        UseQueryOptions<ReferenceRecordType[]>,
        'queryFn' | 'queryKey'
    >;
}

const emptyArray = [];
const defaultFilter = {};

/**
 * Hook that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * @example
 *
 * const { data, error, isFetching, isPending } = useReferenceArrayFieldController({
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} props
 * @param {Object} props.record The current resource record
 * @param {string} props.reference The linked resource name
 * @param {string} props.resource The current resource name
 * @param {string} props.source The key of the linked resource identifier
 *
 * @param {Props} props
 *
 * @returns {ListControllerResult} The reference props
 */
export const useReferenceArrayFieldController = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: UseReferenceArrayFieldControllerParams<
        RecordType,
        ReferenceRecordType
    >
): ListControllerResult => {
    const {
        filter = defaultFilter,
        page = 1,
        perPage = 1000,
        record,
        reference,
        sort,
        source,
        queryOptions = {},
    } = props;
    const notify = useNotify();
    const value = get(record, source);
    const { meta, ...otherQueryOptions } = queryOptions;
    const ids = Array.isArray(value) ? value : emptyArray;

    const { data, error, isLoading, isFetching, isPending, refetch } =
        useGetManyAggregate<ReferenceRecordType>(
            reference,
            { ids, meta },
            {
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

    const listProps = useList<ReferenceRecordType>({
        data,
        error,
        filter,
        isFetching,
        isLoading,
        isPending,
        page,
        perPage,
        sort,
    });

    return {
        ...listProps,
        defaultTitle: undefined,
        refetch,
        resource: reference,
    };
};
