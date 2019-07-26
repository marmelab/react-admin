import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { crudGetManyAccumulate } from '../actions';
import { Record } from '../types';
import { getReferenceResource } from '../reducer';

interface Option {
    id: string;
    reference: string;
    allowEmpty?: boolean;
}

export interface UseReferenceProps {
    loading: boolean;
    loaded: boolean;
    referenceRecord: Record;
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
 * The reference prop sould be the name of one of the <Resource> components
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
 * @param {boolean} option.allowEmpty do we allow for no referenced record (default to false)
 * @param {string} option.reference The linked resource name
 * @param {string} option.id The id of the reference
 *
 * @returns {ReferenceProps} The reference record
 */
export const useReference = ({
    allowEmpty = false,
    reference,
    id,
}: Option): UseReferenceProps => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (id !== null && typeof id !== 'undefined') {
            dispatch(crudGetManyAccumulate(reference, [id]));
        }
    }, [dispatch, id, reference]);

    const referenceRecord = useReferenceSelector({ reference, id });

    return {
        loading: !referenceRecord && !allowEmpty,
        loaded: !!referenceRecord || allowEmpty,
        referenceRecord,
    };
};

const useReferenceSelector = ({ id, reference }) => {
    const getReferenceRecord = useCallback(
        state => {
            const referenceState = getReferenceResource(state, { reference });

            return referenceState && referenceState.data[id];
        },
        [id, reference]
    );

    return useSelector(getReferenceRecord);
};

export default useReference;
