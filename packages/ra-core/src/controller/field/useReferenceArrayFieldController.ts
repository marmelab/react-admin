import get from 'lodash/get';
import { useMemo } from 'react';
import { RaRecord, SortPayload } from '../../types';
import { useGetManyAggregate } from '../../dataProvider';
import { ListControllerResult, useList } from '../list';
import { useNotify } from '../../notification';

export interface UseReferenceArrayFieldControllerParams<
    RecordType extends RaRecord = RaRecord
> {
    filter?: any;
    page?: number;
    perPage?: number;
    record?: RecordType;
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
 * const { data, error, isFetching, isLoading } = useReferenceArrayFieldController({
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
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: UseReferenceArrayFieldControllerParams<RecordType>
): ListControllerResult => {
    const {
        filter = defaultFilter,
        page = 1,
        perPage = 1000,
        record,
        reference,
        sort = defaultSort,
        source,
    } = props;
    const notify = useNotify();
    const value = get(record, source);

    const ids = useMemo(() => {
        if (Array.isArray(value)) return value;
        console.warn(`Value of field '${source}' is not an array.`, value);
        return emptyArray;
    }, [value, source]);

    const { data, error, isLoading, isFetching, refetch } = useGetManyAggregate<
        ReferenceRecordType
    >(
        reference,
        { ids },
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
        }
    );

    const listProps = useList<ReferenceRecordType>({
        data,
        error,
        filter,
        isFetching,
        isLoading,
        page,
        perPage,
        sort,
    });

    return {
        ...listProps,
        defaultTitle: null,
        refetch,
        resource: reference,
    };
};
