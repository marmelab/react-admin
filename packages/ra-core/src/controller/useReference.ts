import { Record } from '../types';
import { Refetch, useGetMany } from '../dataProvider';

interface Option {
    id: string;
    reference: string;
}

export interface UseReferenceProps {
    loading: boolean;
    loaded: boolean;
    referenceRecord?: Record;
    error?: any;
    refetch: Refetch;
}

/**
 * @typedef ReferenceProps
 * @type {Object}
 * @property {boolean} loading: boolean indicating if the reference is loading
 * @property {boolean} loaded: boolean indicating if the reference has loaded
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
 * const { loading, loaded, referenceRecord } = useReference({
 *     id: 7,
 *     reference: 'users',
 * });
 *
 * @param {Object} option
 * @param {string} option.reference The linked resource name
 * @param {string} option.id The id of the reference
 *
 * @returns {ReferenceProps} The reference record
 */
export const useReference = ({ reference, id }: Option): UseReferenceProps => {
    const { data, error, loading, loaded, refetch } = useGetMany(reference, [
        id,
    ]);
    return {
        referenceRecord: error ? undefined : data[0],
        refetch,
        error,
        loading,
        loaded,
    };
};

export default useReference;
