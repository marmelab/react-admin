import { FETCH_END } from '../../../actions/fetchActions';
import {
    CREATE,
    DELETE,
    DELETE_MANY,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    UPDATE_MANY,
} from '../../../dataFetchActions';

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

// We track the last time data was fetched by adding a property on the data which is an array
// (Hence using defineProperty)
const updateDataFetchedTime = (data, fetchedAt) => {
    Object.defineProperty(data, 'fetchedAt', {
        value: fetchedAt,
    });
}

const initialState = {};
updateDataFetchedTime(initialState, {}); // non enumerable by default

export default (previousState = initialState, { payload, meta }) => {
    if (meta && meta.optimistic) {
        if (meta.fetch === UPDATE) {
            const updatedRecord = { ...previousState[payload.id], ...payload.data };
            return addRecords([updatedRecord], previousState);
        }
        if (meta.fetch === UPDATE_MANY) {
            const updatedRecords = payload.ids
                .reduce((records, id) => records.concat(previousState[id]), [])
                .map(record => ({ ...record, ...payload.data }));
            return addRecords(updatedRecords, previousState);
        }
        if (meta.fetch === DELETE) {
            const { [payload.id]: removed, ...newState } = previousState;

            updateDataFetchedTime(newState, previousState.fetchedAt);

            return newState;
        }
        if (meta.fetch === DELETE_MANY) {
            const newState = Object.entries(previousState)
                .filter(([key]) => !payload.ids.includes(key))
                .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

            updateDataFetchedTime(newState, previousState.fetchedAt);

            return newState;
        }
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
