import { FETCH_END } from '../../../actions/fetchActions';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
} from '../../../dataFetchActions';
import {
    CRUD_DELETE_OPTIMISTIC,
    CRUD_DELETE_MANY_OPTIMISTIC,
    CRUD_UPDATE_OPTIMISTIC,
    CRUD_UPDATE_MANY_OPTIMISTIC,
} from '../../../actions/dataActions';

import getFetchedAt from '../../../util/getFetchedAt';

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
export const addRecordsFactory = getFetchedAt => (
    newRecords = [],
    oldRecords
) => {
    const newFetchedAt = getFetchedAt(
        newRecords.map(({ id }) => id),
        oldRecords.fetchedAt
    );

    const newRecordsById = newRecords.reduce(
        (acc, record) => ({
            ...acc,
            [record.id]: record,
        }),
        {}
    );

    const records = Object.keys(newFetchedAt).reduce(
        (acc, id) => ({
            ...acc,
            [id]: newRecordsById[id] || oldRecords[id],
        }),
        {}
    );

    Object.defineProperty(records, 'fetchedAt', {
        value: newFetchedAt,
    }); // non enumerable by default

    return records;
};

const addRecords = addRecordsFactory(getFetchedAt);

const initialState = {};
Object.defineProperty(initialState, 'fetchedAt', { value: {} }); // non enumerable by default

export default (previousState = initialState, { type, payload, meta }) => {
    if (type === CRUD_UPDATE_OPTIMISTIC) {
        const updatedRecord = { ...previousState[payload.id], ...payload.data };
        return addRecords([updatedRecord], previousState);
    }
    if (type === CRUD_UPDATE_MANY_OPTIMISTIC) {
        const updatedRecords = payload.ids
            .reduce((records, id) => records.concat(previousState[id]), [])
            .map(record => ({ ...record, ...payload.data }));
        return addRecords(updatedRecords, previousState);
    }
    if (type === CRUD_DELETE_OPTIMISTIC) {
        const newState = Object.keys(previousState).reduce((acc, id) => {
            if (id === payload.id) {
                return acc;
            }

            return {
                ...acc,
                [id]: previousState[id],
            };
        }, {});

        Object.defineProperty(newState, 'fetchedAt', {
            value: previousState.fetchedAt,
        });

        return newState;
    }
    if (type === CRUD_DELETE_MANY_OPTIMISTIC) {
        const newState = Object.keys(previousState).reduce((acc, id) => {
            if (payload.ids.includes(id)) {
                return acc;
            }

            return {
                ...acc,
                [id]: previousState[id],
            };
        }, {});

        Object.defineProperty(newState, 'fetchedAt', {
            value: previousState.fetchedAt,
        });

        return newState;
    }
    if (!meta || !meta.fetchResponse || meta.fetchStatus !== FETCH_END) {
        return previousState;
    }
    switch (meta.fetchResponse) {
        case GET_LIST:
        case GET_MANY:
        case GET_MANY_REFERENCE:
            return addRecords(payload.data, previousState);
        case GET_ONE:
        case UPDATE:
        case CREATE:
            return addRecords([payload.data], previousState);
        default:
            return previousState;
    }
};

export const getRecord = (state, id) => state[id];
