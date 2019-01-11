import uniq from 'lodash/uniq';
import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_GET_MANY_SUCCESS,
    CRUD_GET_MANY_REFERENCE_SUCCESS,
    CRUD_GET_ONE_SUCCESS,
    CRUD_CREATE_SUCCESS,
    CRUD_UPDATE_SUCCESS,
} from '../../../../actions/dataActions';

import getFetchedAt from '../../../../util/getFetchedAt';
import { DELETE, DELETE_MANY } from '../../../../dataFetchActions';

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

export default (previousState = [], { type, payload, meta }) => {
    if (meta && meta.optimistic) {
        if (meta.fetch === DELETE) {
            const index = previousState
                .map(el => el == payload.id) // eslint-disable-line eqeqeq
                .indexOf(true);
            if (index === -1) {
                return previousState;
            }
            const newState = [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        if (meta.fetch === DELETE_MANY) {
            const newState = previousState.filter(
                el => !payload.ids.includes(el)
            );
            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
    }

    switch (type) {
        case CRUD_GET_LIST_SUCCESS:
            return addRecordIds(payload.data.map(({ id }) => id), []);
        case CRUD_GET_MANY_SUCCESS:
        case CRUD_GET_MANY_REFERENCE_SUCCESS:
            return addRecordIds(
                payload.data
                    .map(({ id }) => id)
                    .filter(id => previousState.indexOf(id) !== -1),
                previousState
            );
        case CRUD_GET_ONE_SUCCESS:
        case CRUD_CREATE_SUCCESS:
        case CRUD_UPDATE_SUCCESS:
            return addRecordIds([payload.data.id], previousState);
        default:
            return previousState;
    }
};

export const getIds = state => state;
