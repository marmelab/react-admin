import pickBy from 'lodash.pickby';

const cacheDuration = 10 * 60 * 1000; // ten minutes

export default (newRecordIds = [], oldRecordFetchedAt) => {
    // prepare new records and timestamp them
    const now = new Date();
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
