import { CRUD_GET_MANY, CRUD_GET_LIST_SUCCESS, CRUD_DELETE_SUCCESS } from '../../../actions/dataActions';

const cacheDuration = 10 * 60 * 1; // ten minutes

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
const addRecords = (newRecords = [], oldRecords) => {
    // prepare new records and timestamp them
    const newRecordsById = newRecords.reduce((prev, record) => {
        prev[record.id] = record; // eslint-disable-line no-param-reassign
        return prev;
    }, []);
    const now = new Date();
    const newRecordsFetchedAt = newRecords.reduce((prev, record) => {
        prev[record.id] = now; // eslint-disable-line no-param-reassign
        return prev;
    }, []);
    // remove outdated old records
    const latestValidDate = new Date();
    latestValidDate.setTime(latestValidDate.getTime() - cacheDuration);
    const oldValidRecordIds = oldRecords.fetchedAt
        ? Object.keys(oldRecords.fetchedAt)
            .filter(id => oldRecords.fetchedAt[id] > latestValidDate)
        : [];
    const oldValidRecords = oldValidRecordIds.reduce((prev, id) => {
        prev[id] = oldRecords[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, []);
    const oldValidRecordsFetchedAt = oldValidRecordIds.reduce((prev, id) => {
        prev[id] = oldRecords.fetchedAt[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, []);
    // combine old records and new records
    const records = [
        ...oldValidRecords,
        ...newRecordsById,
    ];
    Object.defineProperty(records, 'fetchedAt', { value: {
        ...oldValidRecordsFetchedAt,
        ...newRecordsFetchedAt,
    } }); // non enumerable by default
    return records;
};

const initialState = [];
Object.defineProperty(initialState, 'fetchedAt', { value: {} }); // non enumerable by default

export default resource => (previousState = initialState, { type, payload, requestPayload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_MANY:
        return addRecords(payload.data, previousState);
    case CRUD_GET_LIST_SUCCESS:
        return payload.data.map(record => record.id);
    case CRUD_DELETE_SUCCESS: {
        const index = previousState.findIndex(el => el == requestPayload.id); // eslint-disable-line eqeqeq
        if (index === -1) {
            return previousState;
        }
        return [...previousState.slice(0, index), ...previousState.slice(index + 1)];
    }
    default:
        return previousState;
    }
};

export const getIds = state => state;
