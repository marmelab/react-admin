import expect from 'expect';

import getFetchedAt from './getFetchedAt';

describe('getFetchedAt', () => {
    it('should return now date for every newRecordsId', () => {
        const cacheDuration = 10 * 60 * 1000;
        const now = new Date();
        const newRecordIds = [1, 2, 3];

        expect(getFetchedAt(newRecordIds, {}, now, cacheDuration)).toEqual({
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

        expect(
            getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration)
        ).toEqual({
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

        expect(
            getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration)
        ).toEqual({
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

        expect(
            getFetchedAt(newRecordIds, oldFetchedData, now, cacheDuration)
        ).toEqual({
            1: now,
            2: now,
            3: now,
        });
    });
});
