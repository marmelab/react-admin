import { FETCH_END } from '../../../actions/fetchActions';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
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

const initialState = {};
Object.defineProperty(initialState, 'fetchedAt', { value: {} }); // non enumerable by default

export default (previousState = initialState, { payload, meta }) => {
    if (!meta) {
        return previousState;
    }

    if ((meta.effect || meta.fetch) === UPDATE && meta.optimistic) {
        const updatedRecord = {
            ...previousState[payload.id],
            ...(meta.effectData || payload.data),
        };
        const newState = addRecords([updatedRecord], previousState);
        return newState;
    }
    if ((meta.effect || meta.fetch) === UPDATE_MANY && meta.optimistic) {
        const updatedRecords = payload.ids
            .reduce((records, id) => records.concat(previousState[id]), [])
            .map(record => ({
                ...record,
                ...(meta.effectData || payload.data),
            }));
        return addRecords(updatedRecords, previousState);
    }
    if ((meta.effect || meta.fetch) === DELETE && meta.optimistic) {
        const { [payload.id]: removed, ...newState } = previousState;

        Object.defineProperty(newState, 'fetchedAt', {
            value: previousState.fetchedAt,
        });

        return newState;
    }
    if ((meta.effect || meta.fetch) === DELETE_MANY && meta.optimistic) {
        const newState = Object.entries(previousState)
            .filter(([key]) => !payload.ids.includes(key))
            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

        Object.defineProperty(newState, 'fetchedAt', {
            value: previousState.fetchedAt,
        });

        return newState;
    }
    if (
        !meta ||
        (!meta.effect && !meta.fetchResponse) ||
        meta.fetchStatus !== FETCH_END
    ) {
        return previousState;
    }
    switch (meta.effect || meta.fetchResponse) {
        case GET_LIST:
        case GET_MANY:
        case GET_MANY_REFERENCE:
            return addRecords(payload.data, previousState);
        case GET_ONE:
        case UPDATE:
        case CREATE:
            return addRecords([payload.data], previousState);
        case UPDATE_MANY: {
            const updatedRecords = payload.ids
                .reduce((records, id) => records.concat(previousState[id]), [])
                .map(record => ({
                    ...record,
                    ...payload.data,
                }));
            return addRecords(updatedRecords, previousState);
        }
        default:
            return previousState;
    }
};

export const getRecord = (state, id) => state[id];
