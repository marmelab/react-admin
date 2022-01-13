import { RaRecord } from '../types';
import { UseGetManyHookValue, useGetManyAggregate } from '../dataProvider';

interface UseReferenceProps {
    id: string;
    reference: string;
}

export interface UseReferenceResult<RaRecordType extends RaRecord = any> {
    isLoading: boolean;
    isFetching: boolean;
    referenceRecord?: RaRecordType;
    error?: any;
    refetch: UseGetManyHookValue<RaRecordType>['refetch'];
}

/**
 * @typedef UseReferenceResult
 * @type {Object}
 * @property {boolean} isFetching: boolean indicating if the reference is loading
 * @property {boolean} isLoading: boolean indicating if the reference has loaded
 * @property {Object} referenceRecord: the referenced record.
 */

/**
 * Fetch reference record, and return it when available
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { isLoading, referenceRecord } = useReference({
 *     id: 7,
 *     reference: 'users',
 * });
 *
 * @param {Object} option
 * @param {string} option.reference The linked resource name
 * @param {string} option.id The id of the reference
 *
 * @returns {UseReferenceResult} The reference record
 */
export const useReference = <RaRecordType extends RaRecord = any>({
    reference,
    id,
}: UseReferenceProps): UseReferenceResult<RaRecordType> => {
    const { data, error, isLoading, isFetching, refetch } = useGetManyAggregate<
        RaRecordType
    >(reference, { ids: [id] });
    return {
        referenceRecord: error ? undefined : data ? data[0] : undefined,
        refetch,
        error,
        isLoading,
        isFetching,
    };
};
