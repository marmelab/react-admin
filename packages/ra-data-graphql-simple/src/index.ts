import merge from 'lodash/merge';
import buildDataProvider, { BuildQueryFactory, Options } from 'ra-data-graphql';
import { DataProvider, Identifier } from 'ra-core';

import defaultBuildQuery from './buildQuery';
const defaultOptions = {
    buildQuery: defaultBuildQuery,
};

export const buildQuery = defaultBuildQuery;

export default (
    options: Omit<Options, 'buildQuery'> & { buildQuery?: BuildQueryFactory }
): Promise<DataProvider> => {
    return buildDataProvider(merge({}, defaultOptions, options)).then(
        defaultDataProvider => {
            return {
                ...defaultDataProvider,
                // This provider does not support multiple deletions so instead we send multiple DELETE requests
                // This can be optimized using the apollo-link-batch-http link
                deleteMany: (resource, params) => {
                    const { ids, ...otherParams } = params;
                    return Promise.all(
                        ids.map(id =>
                            defaultDataProvider.delete(resource, {
                                id,
                                previousData: null,
                                ...otherParams,
                            })
                        )
                    ).then(results => {
                        const data = results.reduce<Identifier[]>(
                            (acc, { data }) => [...acc, data.id],
                            []
                        );

                        return { data };
                    });
                },
                // This provider does not support multiple deletions so instead we send multiple UPDATE requests
                // This can be optimized using the apollo-link-batch-http link
                updateMany: (resource, params) => {
                    const { ids, data, ...otherParams } = params;
                    return Promise.all(
                        ids.map(id =>
                            defaultDataProvider.update(resource, {
                                id,
                                data: data,
                                previousData: null,
                                ...otherParams,
                            })
                        )
                    ).then(results => {
                        const data = results.reduce<Identifier[]>(
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
