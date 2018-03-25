import { FETCH_END } from '../../../actions/fetchActions';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
} from '../../../dataFetchActions';
import {
    CRUD_UPDATE_OPTIMISTIC,
    CRUD_UPDATE_MANY_OPTIMISTIC,
    CRUD_DELETE_OPTIMISTIC,
    CRUD_DELETE_OPTIMISTIC_UNDO,
    CRUD_DELETE_MANY_OPTIMISTIC,
    CRUD_DELETE_MANY_OPTIMISTIC_UNDO,
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
const removeRecords = (ids, state) => {
    const nextState = { ...state };
    ids && ids.forEach(id => delete nextState[id]);
    Object.defineProperty(nextState, 'fetchedAt', {
        value: state.fetchedAt,
    });
    return nextState;
};

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
        return removeRecords([payload.id], previousState);
    }
    if (type === CRUD_DELETE_OPTIMISTIC_UNDO) {
        return addRecords([payload.previousData], previousState);
    }
    if (type === CRUD_DELETE_MANY_OPTIMISTIC) {
        return removeRecords(payload.ids, previousState);
    }
    if (type === CRUD_DELETE_MANY_OPTIMISTIC_UNDO) {
        return addRecords(payload.previousData, previousState);
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
        case DELETE:
            return removeRecords([payload.id], previousState);
        case DELETE_MANY:
            return removeRecords(payload.ids, previousState);
        default:
            return previousState;
    }
};

export const getRecord = (state, id) => state[id];
