import { DataProvider, FetchRelatedRecords } from '../types';
import { getRelatedIds } from './getRelatedIds';

/**
 * Helper function for calling the dataProvider.getMany() method,
 * and getting a Promise for the records indexed by id in return.
 *
 * @example
 *     fetchRelatedRecords(dataProvider)(records, 'post_id', 'posts').then(posts =>
 *         posts.map(record => ({
 *             ...record,
 *             post_title: posts[record.post_id].title,
 *         }))
 *     );
 */
export const fetchRelatedRecords =
    (dataProvider: DataProvider): FetchRelatedRecords =>
    (data, field, resource) =>
        dataProvider
            .getMany(resource, { ids: getRelatedIds(data, field) })
            .then(({ data }) =>
                data.reduce((acc, post) => {
                    acc[post.id] = post;
                    return acc;
                }, {})
            );
