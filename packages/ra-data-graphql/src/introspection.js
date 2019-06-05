import { introspectionQuery } from 'graphql';
import gql from 'graphql-tag';
import { GET_LIST, GET_ONE } from 'ra-core';

import { ALL_TYPES } from './constants';

export const filterTypesByIncludeExclude = ({ include, exclude }) => {
    if (Array.isArray(include)) {
        return type => include.includes(type.name);
    }

    if (typeof include === 'function') {
        return type => include(type);
    }

    if (Array.isArray(exclude)) {
        return type => !exclude.includes(type.name);
    }

    if (typeof exclude === 'function') {
        return type => !exclude(type);
    }

    return () => true;
};

/**
 * @param {ApolloClient} client The Apollo client
 * @param {Object} options The introspection options
 */
export default async (client, options) => {
    const schema = options.schema
        ? options.schema
        : await client
              .query({
                  fetchPolicy: 'network-only',
                  query: gql`
                      ${introspectionQuery}
                  `,
              })
              .then(({ data: { __schema } }) => __schema);

    const queries = schema.types.reduce((acc, type) => {
        if (type.name !== schema.queryType.name && type.name !== schema.mutationType.name) return acc;

        return [...acc, ...type.fields];
    }, []);

    const types = schema.types.filter(
        type => type.name !== schema.queryType.name && type.name !== schema.mutationType.name
    );

    const isResource = type =>
        queries.some(query => query.name === options.operationNames[GET_LIST](type)) &&
        queries.some(query => query.name === options.operationNames[GET_ONE](type));

    const buildResource = type =>
        ALL_TYPES.reduce(
            (acc, aorFetchType) => ({
                ...acc,
                [aorFetchType]: queries.find(
                    query =>
                        options.operationNames[aorFetchType] && query.name == options.operationNames[aorFetchType](type)
                ),
            }),
            { type }
        );

    const potentialResources = types.filter(isResource);
    const filteredResources = potentialResources.filter(filterTypesByIncludeExclude(options));
    const resources = filteredResources.map(buildResource);

    return {
        types,
        queries,
        resources,
        schema,
    };
};
