import assert from 'assert';

import { DELETE, DELETE_MANY } from '../../../dataFetchActions';

jest.mock('../../../util/getFetchedAt');
import getFetchedAt from '../../../util/getFetchedAt';
import dataReducer, { addRecords } from './data';

describe('data addRecordsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldFetchedAt = {};
        const date1 = new Date();
        const date2 = new Date();
        const oldRecords = {
            fetchedAt: oldFetchedAt,
        };
        // @ts-ignore
        getFetchedAt.mockImplementationOnce(() => ({
            record1: date1,
            record2: date2,
        }));

        const newState = addRecords(newRecords, oldRecords);

        // @ts-ignore
        assert.deepEqual(getFetchedAt.mock.calls[0], [
            ['record1', 'record2'],
            oldFetchedAt,
        ]);

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });

        assert.deepEqual(newState.fetchedAt, {
            record1: date1,
            record2: date2,
        });
    });

    it('should discard record that do not have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = {
            record3: { id: 'record3' },
            fetchedAt: { record3: new Date() },
        };

        // @ts-ignore
        getFetchedAt.mockImplementationOnce(() => ({
            record1: new Date(),
            record2: new Date(),
        }));

        const newState = addRecords(newRecords, oldRecords);

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });
    });

    it('should keep record that have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = {
            record3: { id: 'record3' },
            fetchedAt: { record3: new Date() },
        };
        // @ts-ignore
        getFetchedAt.mockImplementationOnce(() => ({
            record1: new Date(),
            record2: new Date(),
            record3: new Date(),
        }));

        const newState = addRecords(newRecords, oldRecords);

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
            record3: { id: 'record3' },
        });
    });

    it('should replace oldRecord by new record', () => {
        const newRecords = [
            { id: 'record1', title: 'new title' },
            { id: 'record2' },
        ];
        const oldRecords = {
            record1: { id: 'record1', title: 'old title' },
            fetchedAt: { record1: new Date() },
        };
        // @ts-ignore
        getFetchedAt.mockImplementationOnce(() => ({
            record1: new Date(),
            record2: new Date(),
        }));

        const newState = addRecords(newRecords, oldRecords);

        assert.deepEqual(newState, {
            record1: { id: 'record1', title: 'new title' },
            record2: { id: 'record2' },
        });
    });
});

describe('Resources data reducer', () => {
    describe('optimistic DELETE', () => {
        it('removes the deleted record', () => {
            const now = new Date();
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: now,
                    record2: now,
                    record3: now,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { id: 'record2' },
                meta: {
                    fetch: DELETE,
                    optimistic: true,
                },
            });
            assert.deepEqual(newState, {
                record1: { id: 'record1', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            });
            assert.deepEqual(newState.fetchedAt, {
                record1: now,
                record3: now,
            });
        });
    });
    describe('optimistic DELETE_MANY', () => {
        it('removes the deleted records', () => {
            const now = new Date();
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: now,
                    record2: now,
                    record3: now,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { ids: ['record3', 'record2'] },
                meta: {
                    fetch: DELETE_MANY,
                    optimistic: true,
                },
            });
            assert.deepEqual(newState, {
                record1: { id: 'record1', prop: 'value' },
            });
            assert.deepEqual(newState.fetchedAt, {
                record1: now,
            });
        });
    });
});
