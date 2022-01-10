import get from 'lodash/get';

import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../sideEffect';
import { Record } from '../../types';
import { UseReferenceResult } from '../useReference';

export interface UseReferenceOneFieldControllerParams {
    record?: Record;
    reference: string;
    source?: string;
    target: string;
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
 * @prop {string} props.source The key current record identifieer ('id' by default)
 *
 * @param {UseReferenceOneFieldControllerParams}
 *
 * @returns {UseReferenceResult} The request state. Destructure as { referenceRecord, isLoading, error }.
 */
export const useReferenceOneFieldController = (
    props: UseReferenceOneFieldControllerParams
): UseReferenceResult => {
    const { reference, record, target, source = 'id' } = props;
    const notify = useNotify();

    const { data, error, isFetching, isLoading, refetch } = useGetManyReference(
        reference,
        {
            target,
            id: get(record, source),
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
        },
        {
            enabled: !!record,
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

    return {
        referenceRecord: data ? data[0] : undefined,
        error,
        isFetching,
        isLoading,
        refetch,
    };
};
