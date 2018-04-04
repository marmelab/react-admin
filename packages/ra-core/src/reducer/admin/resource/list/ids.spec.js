import assert from 'assert';

import { addRecordIdsFactory } from './ids';

describe('data addRecordIdsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords = ['record1', 'record2'];
        const oldRecords = [];
        oldRecords.fetchedAt = 'previousFetchetAt';
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordIdsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, ['record1', 'record2']);

        assert.deepEqual(getFetchedAt.mock.calls[0], [
            ['record1', 'record2'],
            'previousFetchetAt',
        ]);

        assert.deepEqual(newState.fetchedAt, {
            record1: 'date',
            record2: 'date',
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
