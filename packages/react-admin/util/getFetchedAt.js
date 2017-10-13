import pickBy from 'lodash.pickby';

const defaultCacheDuration = 10 * 60 * 1000; // ten minutes

export default (
    newRecordIds = [],
    oldRecordFetchedAt = {},
    now = new Date(),
    cacheDuration = defaultCacheDuration
) => {
    // prepare new records and timestamp them
    const newFetchedAt = newRecordIds.reduce(
        (prev, recordId) => ({
            ...prev,
            [recordId]: now,
        }),
        {}
    );
    // remove outdated entry
    const latestValidDate = new Date();
    latestValidDate.setTime(latestValidDate.getTime() - cacheDuration);

    const stillValidFetchedAt = pickBy(
        oldRecordFetchedAt,
        date => date > latestValidDate
    );

    return {
        ...stillValidFetchedAt,
        ...newFetchedAt,
    };
};
