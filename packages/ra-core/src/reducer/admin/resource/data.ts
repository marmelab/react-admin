import { Reducer } from 'redux';
import isEqual from 'lodash/isEqual';
import { FETCH_END } from '../../../actions';
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
} from '../../../core';
import getFetchedAt from '../../../util/getFetchedAt';
import { Record, Identifier } from '../../../types';

/**
 * A list of records indexed by id, together with their fetch dates
 *
 * Note that the fetchedAt property isn't enumerable.
 *
 * @example
 * {
 *      12: { id: 12, title: "hello" },
 *      34: { id: 34, title: "world" },
 *      fetchedAt: {
 *          12: new Date('2019-02-06T21:23:07.049Z'),
 *          34: new Date('2019-02-06T21:23:07.049Z'),
 *      }
 * }
 */
interface RecordSetWithDate {
    // FIXME: use [key: Identifier] once typeScript accepts any type as index (see https://github.com/Microsoft/TypeScript/pull/26797)
    [key: string]: Record | object;
    [key: number]: Record;
    fetchedAt: {
        // FIXME: use [key: Identifier] once typeScript accepts any type as index (see https://github.com/Microsoft/TypeScript/pull/26797)
        [key: string]: Date;
        [key: number]: Date;
    };
}

/**
 * Make the fetchedAt property non enumerable
 */
export const hideFetchedAt = (
    records: RecordSetWithDate
): RecordSetWithDate => {
    Object.defineProperty(records, 'fetchedAt', {
        enumerable: false,
        configurable: false,
        writable: false,
    });
    return records;
};

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
export const addRecordsAndRemoveOutdated = (
    newRecords: Record[] = [],
    oldRecords: RecordSetWithDate
): RecordSetWithDate => {
    const newRecordsById = {};
    newRecords.forEach(record => (newRecordsById[record.id] = record));

    const newFetchedAt = getFetchedAt(
        newRecords.map(({ id }) => id),
        oldRecords.fetchedAt
    );

    const records = { fetchedAt: newFetchedAt };
    Object.keys(newFetchedAt).forEach(
        id =>
            (records[id] = newRecordsById[id]
                ? isEqual(newRecordsById[id], oldRecords[id])
                    ? oldRecords[id] // do not change the record to avoid a redraw
                    : newRecordsById[id]
                : oldRecords[id])
    );

    return hideFetchedAt(records);
};

/**
 * Add new records to the pool, without touching the other ones.
 */
export const addRecords = (
    newRecords: Record[] = [],
    oldRecords: RecordSetWithDate
): RecordSetWithDate => {
    const newRecordsById = { ...oldRecords };
    newRecords.forEach(record => {
        newRecordsById[record.id] = isEqual(record, oldRecords[record.id])
            ? (oldRecords[record.id] as Record)
            : record;
    });

    const updatedFetchedAt = getFetchedAt(
        newRecords.map(({ id }) => id),
        oldRecords.fetchedAt
    );

    Object.defineProperty(newRecordsById, 'fetchedAt', {
        value: { ...oldRecords.fetchedAt, ...updatedFetchedAt },
        enumerable: false,
    });

    return newRecordsById;
};

export const addOneRecord = (
    newRecord: Record,
    oldRecords: RecordSetWithDate,
    date = new Date()
): RecordSetWithDate => {
    const newRecordsById = {
        ...oldRecords,
        [newRecord.id]: isEqual(newRecord, oldRecords[newRecord.id])
            ? oldRecords[newRecord.id] // do not change the record to avoid a redraw
            : newRecord,
    } as RecordSetWithDate;

    return Object.defineProperty(newRecordsById, 'fetchedAt', {
        value: { ...oldRecords.fetchedAt, [newRecord.id]: date },
        enumerable: false,
    });
};

const includesNotStrict = (items, element) =>
    items.some(item => item == element); // eslint-disable-line eqeqeq

/**
 * Remove records from the pool
 */
export const removeRecords = (
    removedRecordIds: Identifier[] = [],
    oldRecords: RecordSetWithDate
): RecordSetWithDate => {
    const records = Object.entries(oldRecords)
        .filter(([key]) => !includesNotStrict(removedRecordIds, key))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {
            fetchedAt: {}, // TypeScript warns later if this is not defined
        });
    records.fetchedAt = Object.entries(oldRecords.fetchedAt)
        .filter(([key]) => !includesNotStrict(removedRecordIds, key))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    return hideFetchedAt(records);
};

const initialState = hideFetchedAt({ fetchedAt: {} });

const dataReducer: Reducer<RecordSetWithDate> = (
    previousState = initialState,
    { payload, meta }
) => {
    if (meta && meta.optimistic) {
        if (meta.fetch === UPDATE) {
            const updatedRecord = {
                ...previousState[payload.id],
                ...payload.data,
            };
            return addOneRecord(updatedRecord, previousState);
        }
        if (meta.fetch === UPDATE_MANY) {
            const updatedRecords = payload.ids.map(id => ({
                ...previousState[id],
                ...payload.data,
            }));
            return addRecordsAndRemoveOutdated(updatedRecords, previousState);
        }
        if (meta.fetch === DELETE) {
            return removeRecords([payload.id], previousState);
        }
        if (meta.fetch === DELETE_MANY) {
            return removeRecords(payload.ids, previousState);
        }
    }
    if (!meta || !meta.fetchResponse || meta.fetchStatus !== FETCH_END) {
        return previousState;
    }

    switch (meta.fetchResponse) {
        case GET_LIST:
            return addRecordsAndRemoveOutdated(payload.data, previousState);
        case GET_MANY:
        case GET_MANY_REFERENCE:
            return addRecords(payload.data, previousState);
        case UPDATE:
        case CREATE:
        case GET_ONE:
            return addOneRecord(payload.data, previousState);
        default:
            return previousState;
    }
};

export const getRecord = (state, id) => state[id];

export default dataReducer;
