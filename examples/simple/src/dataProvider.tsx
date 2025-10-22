import fakeRestProvider from 'ra-data-fakerest';
import { DataProvider, withLifecycleCallbacks, HttpError } from 'react-admin';
import get from 'lodash/get.js';
import addUploadFeature from './addUploadFeature';
import { queryClient } from './queryClient';
import data from './data';

const defaultDataProvider = fakeRestProvider(data, true, 300);

const dataProvider = withLifecycleCallbacks(defaultDataProvider, [
    {
        resource: 'posts',
        beforeDelete: async ({ id }, dp) => {
            // delete related comments
            const { data: comments } = await dp.getList('comments', {
                filter: { post_id: id },
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'id', order: 'DESC' },
            });
            await dp.deleteMany('comments', {
                ids: comments.map(comment => comment.id),
            });
            // The queryClient would be unaware of the deleted comments without this.
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            return { id };
        },
    },
]);

const addTagsSearchSupport = (dataProvider: DataProvider) => ({
    ...dataProvider,
    getList: (resource, params) => {
        if (resource === 'comments') {
            // partial pagination
            return dataProvider
                .getList(resource, params)
                .then(({ data, total, meta }) => ({
                    data,
                    pageInfo: {
                        hasNextPage:
                            params.pagination.perPage * params.pagination.page <
                            (total || 0),
                        hasPreviousPage: params.pagination.page > 1,
                    },
                    meta,
                }));
        }
        if (resource === 'tags') {
            const matchSearchFilter = Object.keys(params.filter).find(key =>
                key.endsWith('_q')
            );
            if (matchSearchFilter) {
                const searchRegExp = new RegExp(
                    params.filter[matchSearchFilter],
                    'i'
                );

                return dataProvider.getList(resource, {
                    ...params,
                    filter: item => {
                        const matchPublished =
                            item.published == params.filter.published; // eslint-disable-line eqeqeq

                        const fieldName = matchSearchFilter.replace(
                            /(_q)$/,
                            ''
                        );
                        return (
                            matchPublished &&
                            get(item, fieldName).match(searchRegExp) !== null
                        );
                    },
                });
            }
        }

        return dataProvider.getList(resource, params);
    },
});

const uploadCapableDataProvider = addUploadFeature(
    addTagsSearchSupport(dataProvider)
);

const sometimesFailsDataProvider = new Proxy(uploadCapableDataProvider, {
    get: (target, name) => (resource, params) => {
        if (typeof name === 'symbol' || name === 'then') {
            return;
        }
        // set session_ended=true in localStorage to trigger an API auth error
        if (localStorage.getItem('session_ended')) {
            const error = new Error('Session ended') as ResponseError;
            error.status = 403;
            return Promise.reject(error);
        }
        // add rejection by type or resource here for tests, e.g.
        // if (name === 'delete' && resource === 'posts') {
        //     return Promise.reject(new Error('deletion error'));
        // }
        if (
            resource === 'posts' &&
            params.data &&
            params.data.title === 'f00bar'
        ) {
            return Promise.reject(
                new HttpError('The form is invalid', 400, {
                    errors: {
                        title: 'this title cannot be used',
                    },
                })
            );
        }
        return uploadCapableDataProvider[name](resource, params);
    },
});

interface ResponseError extends Error {
    status?: number;
}

export default sometimesFailsDataProvider;
