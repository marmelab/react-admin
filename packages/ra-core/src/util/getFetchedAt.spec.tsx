import assert from 'assert';

import getFetchedAt from './getFetchedAt';

describe('getFetchedAt', () => {
    it('should return now date for every newRecordsId', () => {
        const cacheDuration = 10 * 60 * 1000;
        const now = new Date();
        const newRecordIds = [1, 2, 3];

        assert.deepEqual(getFetchedAt(newRecordIds, {}, now, cacheDuration), {
            1: now,
            2: now,
            3: now,
        });
    });

    it('should keep old date if it is still valid', () => {
        const cacheDuration = 10 * 60 * 1000;
        const now = new Date();
        const newRecordIds = [1, 2, 3];
        const validDate = new Date();
        validDate.setTime(now.getTime() - cacheDuration / 2);

        const oldFetchedData = {
            4: validDate,
        };

        assert.deepEqual(getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration), {
            1: now,
            2: now,
            3: now,
            4: validDate,
        });
    });

    it('should discard old date if it is not valid anymore', () => {
        const cacheDuration = 10 * 60 * 1000;
        const now = new Date();
        const newRecordIds = [1, 2, 3];
        const invalidDate = new Date();
        invalidDate.setTime(now.getTime() - cacheDuration);

        const oldFetchedData = {
            4: invalidDate,
        };

        assert.deepEqual(getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration), {
            1: now,
            2: now,
            3: now,
        });
    });

    it('should update old date if id present in newRecordsId even if not valid anymore', () => {
        const cacheDuration = 10 * 60 * 1000;
        const now = new Date();
        const newRecordIds = [1, 2, 3];
        const validDate = new Date();
        validDate.setTime(now.getTime() - cacheDuration / 2);
        const invalidDate = new Date();
        invalidDate.setTime(now.getTime() - cacheDuration);

        const oldFetchedData = {
            1: validDate,
            2: invalidDate,
        };

        assert.deepEqual(getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration), {
            1: now,
            2: now,
            3: now,
        });
    });
});
