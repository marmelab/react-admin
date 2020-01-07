import assert from 'assert';

import {
    IdentifierArrayWithDate,
    addRecordIdsFactory,
    addOneRecordId,
} from './ids';

describe('ids addRecordIdsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords: IdentifierArrayWithDate = ['record1', 'record2'];
        const oldRecords: IdentifierArrayWithDate = [];
        const date0 = new Date();
        const date1 = new Date();
        const date2 = new Date();
        oldRecords.fetchedAt = date0;
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: date1,
            record2: date2,
        });

        const newState = addRecordIdsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, ['record1', 'record2']);

        assert.deepEqual(getFetchedAt.mock.calls[0], [
            ['record1', 'record2'],
            date0,
        ]);

        assert.deepEqual(newState.fetchedAt, {
            record1: date1,
            record2: date2,
        });
    });

    it('should discard record that do not have their ids returned by getFetchedAt', () => {
        const newRecords = ['record1', 'record2'];
        const oldRecords = ['record3'];
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordIdsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, ['record1', 'record2']);
    });

    it('should keep record that have their ids returned by getFetchedAt and add newRecords after oldRecords', () => {
        const newRecords = ['record1', 'record2'];
        const oldRecords = ['record3'];
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
            record3: 'date',
        });

        const newState = addRecordIdsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, ['record3', 'record1', 'record2']);
    });
});

describe('ids addOneRecordId', () => {
    it('should add new RecordId without touching the existing ones', () => {
        const now = new Date();
        const before = new Date(0);
        const oldRecords = ['record1', 'record2', 'record3'];
        // @ts-ignore
        oldRecords.fetchedAt = {
            record1: before,
            record2: before,
            record3: before,
        };

        const newState = addOneRecordId('new_record', oldRecords);

        assert.deepEqual(newState, [
            'record1',
            'record2',
            'record3',
            'new_record',
        ]);
        assert.deepEqual(newState.fetchedAt, {
            record1: before,
            record2: before,
            record3: before,
            new_record: now,
        });
    });

    it('should update fetchedAt for given id when he is already here', () => {
        const now = new Date();
        const before = new Date(0);
        const oldRecords = ['record1', 'record2', 'record3'];
        // @ts-ignore
        oldRecords.fetchedAt = {
            record1: before,
            record2: before,
            record3: before,
        };

        const newState = addOneRecordId('record1', oldRecords);

        assert.deepEqual(newState, ['record1', 'record2', 'record3']);
        assert.deepEqual(newState.fetchedAt, {
            record1: now,
            record2: before,
            record3: before,
        });
    });
});
