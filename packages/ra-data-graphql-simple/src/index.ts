import merge from 'lodash/merge';
import buildDataProvider, {
    BuildQueryFactory,
    Options,
    defaultOptions as raDataGraphqlDefaultOptions,
} from 'ra-data-graphql';
import { DataProvider, Identifier } from 'ra-core';

import defaultBuildQuery from './buildQuery';
import { DataProviderExtension, DataProviderExtensions } from './extensions';

export const buildQuery = defaultBuildQuery;
export { buildQueryFactory } from './buildQuery';
export { default as buildGqlQuery } from './buildGqlQuery';
export { default as buildVariables } from './buildVariables';
export { default as getResponseParser } from './getResponseParser';

const defaultOptions = {
    ...raDataGraphqlDefaultOptions,
    buildQuery: defaultBuildQuery,
    extensions: [],
};

export { defaultOptions, DataProviderExtensions };

export default (
    options: Omit<Options, 'buildQuery'> & {
        buildQuery?: BuildQueryFactory;
        extensions?: DataProviderExtension[];
    }
): Promise<DataProvider> => {
    const { extensions = [], ...customOptions } = options;
    const dPOptions = merge({}, defaultOptions, customOptions);

    extensions
        .filter(
            ({ introspectionOperationNames }) => !!introspectionOperationNames
        )
        .forEach(({ introspectionOperationNames }) => {
            if (dPOptions.introspection?.operationNames)
                dPOptions.introspection.operationNames = merge(
                    dPOptions.introspection.operationNames,
                    introspectionOperationNames
                );
        });

    return buildDataProvider(dPOptions).then(defaultDataProvider => {
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
            ...extensions.reduce(
                (acc, { methodFactory, factoryArgs = [] }) => ({
                    ...acc,
                    ...methodFactory(...[defaultDataProvider, ...factoryArgs]),
                }),
                {}
            ),
        };
    });
};
