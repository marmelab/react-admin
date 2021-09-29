import { getIntrospectionQuery } from 'graphql';
import { gql } from '@apollo/client';
import { GET_LIST, GET_ONE } from 'ra-core';

import { ALL_TYPES } from './constants';

export const isResourceIncluded = ({ include, type }) => {
    if (Array.isArray(include)) {
        return include.includes(type.name);
    }

    if (typeof include === 'function') {
        return include(type);
    }

    return false;
};

export const isResourceExcluded = ({ exclude, type }) => {
    if (Array.isArray(exclude)) {
        return exclude.includes(type.name);
    }

    if (typeof exclude === 'function') {
        return exclude(type);
    }

    return false;
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
                      ${getIntrospectionQuery()}
                  `,
              })
              .then(({ data: { __schema } }) => __schema);

    const queries = schema.types.reduce((acc, type) => {
        if (
            type.name !== (schema.queryType && schema.queryType.name) &&
            type.name !== (schema.mutationType && schema.mutationType.name)
        )
            return acc;

        return [...acc, ...type.fields];
    }, []);

    const types = schema.types.filter(
        type =>
            type.name !== (schema.queryType && schema.queryType.name) &&
            type.name !== (schema.mutationType && schema.mutationType.name)
    );

    const isResource = type => {
        if (isResourceIncluded({ type, ...options })) return true;
        if (isResourceExcluded({ type, ...options })) return false;

        return (
            queries.some(
                query => query.name === options.operationNames[GET_LIST](type)
            ) &&
            queries.some(
                query => query.name === options.operationNames[GET_ONE](type)
            )
        );
    };

    const buildResource = type =>
        ALL_TYPES.reduce(
            (acc, aorFetchType) => ({
                ...acc,
                [aorFetchType]: queries.find(
                    query =>
                        options.operationNames[aorFetchType] &&
                        query.name ===
                            options.operationNames[aorFetchType](type)
                ),
            }),
            { type }
        );

    const filteredResources = types.filter(isResource);
    const resources = filteredResources.map(buildResource);

    return {
        types,
        queries,
        resources,
        schema,
    };
};
