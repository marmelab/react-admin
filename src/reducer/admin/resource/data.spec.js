import assert from 'assert';
import { stub } from 'sinon';
import createReducer, {
    initialState,
    addRecordsFactory,
    get,
    getByIds,
} from './data';

describe('data addRecordsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = {
            fetchedAt: 'previousFetchedAt',
        };
        const getFetchedAt = stub().returns({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });

        assert(
            getFetchedAt.calledWith(['record1', 'record2'], 'previousFetchedAt')
        );

        assert.deepEqual(newState.fetchedAt, {
            record1: 'date',
            record2: 'date',
        });
    });

    it('should discard record that do not have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record3: 'record3' };
        const getFetchedAt = stub().returns({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });
    });

    it('should keep record that have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record3: 'record3' };
        const getFetchedAt = stub().returns({
            record1: 'date',
            record2: 'date',
            record3: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
            record3: 'record3',
        });
    });

    it('should replace oldRecord by new record', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record1: 'old record 1' };
        const getFetchedAt = stub().returns({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });
    });
});

describe('data reducer', () => {
    it('should return initial state by default', () => {
        assert.equal(initialState, createReducer('posts')(undefined, {}));
    });
});

describe('data selectors', () => {
    const state = {
        ...initialState,
        1: {
            id: 1,
        },
        2: {
            id: 2,
        },
        3: undefined,
    };
    describe('get', () => {
        it('should return a single record', () => {
            assert.deepEqual(get(state, { id: 1 }), {
                id: 1,
            });
        });
    });

    describe('getByIds', () => {
        it('should return an id indexed object of records with no undefined values', () => {
            assert.deepEqual(getByIds(state, { ids: [1, 2, 3] }), {
                1: { id: 1 },
                2: { id: 2 },
            });
        });
    });
});
