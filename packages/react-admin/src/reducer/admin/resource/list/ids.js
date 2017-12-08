import uniq from 'lodash.uniq';
import {
    crudGetList,
    crudDelete,
    crudGetMany,
    crudGetManyReference,
    crudGetOne,
    crudCreate,
    crudUpdate,
} from '../../../../actions/dataActions';

import getFetchedAt from '../../../../util/getFetchedAt';

export const addRecordIdsFactory = getFetchedAt => (
    newRecordIds = [],
    oldRecordIds
) => {
    const newFetchedAt = getFetchedAt(newRecordIds, oldRecordIds.fetchedAt);
    const recordIds = uniq(
        oldRecordIds.filter(id => !!newFetchedAt[id]).concat(newRecordIds)
    );

    Object.defineProperty(recordIds, 'fetchedAt', {
        value: newFetchedAt,
    }); // non enumerable by default
    return recordIds;
};

const addRecordIds = addRecordIdsFactory(getFetchedAt);

export default resource => (
    previousState = [],
    { type, payload, requestPayload, meta }
) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
        case crudGetList.SUCCESS:
            return addRecordIds(payload.data.map(({ id }) => id), []);
        case crudGetMany.SUCCESS:
        case crudGetManyReference.SUCCESS:
            return addRecordIds(
                payload.data
                    .map(({ id }) => id)
                    .filter(id => previousState.indexOf(id) !== -1),
                previousState
            );
        case crudGetOne.SUCCESS:
        case crudCreate.SUCCESS:
        case crudUpdate.SUCCESS:
            return addRecordIds([payload.data.id], previousState);
        case crudDelete.SUCCESS: {
            const index = previousState
                .map(el => el == requestPayload.id) // eslint-disable-line eqeqeq
                .indexOf(true);
            if (index === -1) {
                return previousState;
            }
            const newState = [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];

            Object.defineProperty(
                newState,
                'fetchedAt',
                previousState.fetchedAt
            );

            return newState;
        }
        default:
            return previousState;
    }
};

export const getIds = state => state;
