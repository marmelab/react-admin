import get from 'lodash/get';
import { useMemo } from 'react';
import { RaRecord, SortPayload } from '../../types';
import { useGetManyAggregate } from '../../dataProvider';
import { ListControllerResult, useList } from '../list';
import { useNotify } from '../../notification';

export interface UseReferenceArrayFieldControllerParams {
    filter?: any;
    page?: number;
    perPage?: number;
    record?: RaRecord;
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
export const useReferenceArrayFieldController = (
    props: UseReferenceArrayFieldControllerParams
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
        console.warn(
            `Value of field '${source}' is not an Array type. No records will be matched.`
        );
        return [];
    }, [value]);

    const { data, error, isLoading, isFetching, refetch } = useGetManyAggregate(
        reference,
        { ids },
        {
            onError: error =>
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
