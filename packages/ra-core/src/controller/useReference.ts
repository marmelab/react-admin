import { Record } from '../types';
import { Refetch, useGetManyAggregate } from '../dataProvider';

interface UseReferenceProps {
    id: string;
    reference: string;
}

export interface UseReferenceResult {
    isLoading: boolean;
    isFetching: boolean;
    referenceRecord?: Record;
    error?: any;
    refetch: Refetch;
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
export const useReference = ({
    reference,
    id,
}: UseReferenceProps): UseReferenceResult => {
    const {
        data,
        error,
        isLoading,
        isFetching,
        refetch,
    } = useGetManyAggregate(reference, { ids: [id] });
    return {
        referenceRecord: error ? undefined : data ? data[0] : undefined,
        refetch,
        error,
        isLoading,
        isFetching,
    };
};
