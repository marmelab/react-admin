import assert from 'assert';

import {
    CRUD_DELETE_OPTIMISTIC,
    CRUD_DELETE_MANY_OPTIMISTIC,
} from '../../../actions/dataActions';

import dataReducer, { addRecordsFactory } from './data';

describe('data addRecordsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = {
            fetchedAt: 'previousFetchedAt',
        };
        const getFetchedAt = jest.fn().mockReturnValue({
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

        assert.deepEqual(getFetchedAt.mock.calls[0], [
            ['record1', 'record2'],
            'previousFetchedAt',
        ]);

        assert.deepEqual(newState.fetchedAt, {
            record1: 'date',
            record2: 'date',
        });
    });

    it('should discard record that do not have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record3: 'record3' };
        const getFetchedAt = jest.fn().mockReturnValue({
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
        const getFetchedAt = jest.fn().mockReturnValue({
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
        const getFetchedAt = jest.fn().mockReturnValue({
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

describe('Resources data reducer', () => {
    describe('CRUD_DELETE_OPTIMISTIC', () => {
        it('removes the deleted record', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_DELETE_OPTIMISTIC,
                    payload: { id: 'record2' },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record3: { id: 'record3', prop: 'value' },
                }
            );
        });
    });
    describe('CRUD_DELETE_MANY_OPTIMISTIC', () => {
        it('removes the deleted records', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_DELETE_MANY_OPTIMISTIC,
                    payload: { ids: ['record3', 'record2'] },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                }
            );
        });
    });
});
