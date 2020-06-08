import merge from 'lodash/merge';
import buildDataProvider from 'ra-data-graphql';

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
                // Graphcool does not support multiple deletions so instead we send multiple DELETE requests
                // This can be optimized using the apollo-link-batch-http link
                deleteMany: (resource, params) => {
                    const { ids, ...otherParams } = params;
                    return Promise.all(
                        params.ids.map(id =>
                            defaultDataProvider.delete(resource, {
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
                // Graphcool does not support multiple deletions so instead we send multiple UPDATE requests
                // This can be optimized using the apollo-link-batch-http link
                updateMany: (resource, params) => {
                    const { ids, ...otherParams } = params;
                    return Promise.all(
                        params.ids.map(id =>
                            defaultDataProvider.update(resource, {
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
            };
        }
    );
};
