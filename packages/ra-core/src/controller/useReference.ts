import { useEffect, useMemo } from 'react';
// @ts-ignore
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
    isLoading: boolean;
    referenceRecord: Record;
}

/**
 * @typedef ReferenceProps
 * @type {Object}
 * @property {boolean} isLoading: boolean indicating if the reference has loaded
 * @property {Object} referenceRecord: the referenced record.
 */

/**
 * Fetch reference record, and return it when avaliable
 *
 * The reference prop sould be the name of one of the <Resource> components
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
    const getReferenceRecord = useMemo(
        () => makeGetReferenceRecord({ id, reference }),
        [id, reference]
    );
    const referenceRecord = useSelector(
        getReferenceRecord,
        (newState, latestState) => {
            console.log({ newState, latestState });
            return newState === latestState;
        }
    );
    useEffect(() => {
        if (id !== null && typeof id !== 'undefined') {
            dispatch(crudGetManyAccumulate(reference, [id]));
        }
    }, [id, reference]);

    return {
        isLoading: !referenceRecord && !allowEmpty,
        referenceRecord,
    };
};

const makeGetReferenceRecord = props => state => {
    const referenceState = getReferenceResource(state, props);
    console.log({ referenceState });
    return referenceState && referenceState.data[props.id];
};

export default useReference;
