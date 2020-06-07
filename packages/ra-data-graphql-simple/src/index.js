import merge from 'lodash/merge';
import buildDataProvider from 'ra-data-graphql';
import { DELETE, UPDATE } from 'ra-core';

import defaultBuildQuery from './buildQuery';
const defaultOptions = {
    buildQuery: defaultBuildQuery,
};

export const buildQuery = defaultBuildQuery;

export default options => {
    return buildDataProvider(merge({}, defaultOptions, options)).then(
        defaultDataProvider => {
            return {
                ...defaultDataProvider,
                // This provider does not support multiple deletions so instead we send multiple UPDATE requests
                // This can be optimized using the apollo-link-batch-http link
                deleteMany: (resource, params) => {
                    const { ids, ...otherParams } = params;
                    return Promise.all(
                        ids.map(id =>
                            defaultDataProvider(DELETE, resource, {
                                id,
                                ...otherParams,
                            })
                        )
                    ).then(results => {
                        const data = results.reduce(
                            (acc, { data }) => [...acc, data.id],
                            []
                        );

                        return { data };
                    });
                },
                // This provider does not support multiple updates so instead we send multiple UPDATE requests
                // This can be optimized using the apollo-link-batch-http link
                updateMany: (resource, params) => {
                    const { ids, data, ...otherParams } = params;
                    return Promise.all(
                        ids.map(id =>
                            defaultDataProvider(UPDATE, resource, {
                                data: {
                                    id,
                                    ...data,
                                },
                                ...otherParams,
                            })
                        )
                    ).then(results => {
                        const data = results.reduce(
                            (acc, { data }) => [...acc, data.id],
                            []
                        );

                        return { data };
                    });
                },
            };
        }
    );
};
