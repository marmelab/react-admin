import {
    getIntrospectionQuery,
    IntrospectionObjectType,
    IntrospectionQuery,
    IntrospectionSchema,
    IntrospectionType,
} from 'graphql';
import { ApolloClient, gql } from '@apollo/client';

import { ALL_TYPES } from './constants';

/**
 * @param {ApolloClient} client The Apollo client
 * @param {Object} options The introspection options
 */
export const introspectSchema = async (
    client: ApolloClient<unknown>,
    options: IntrospectionOptions
) => {
    const schema = options.schema ? options.schema : await fetchSchema(client);
    const queries = getQueriesFromSchema(schema);
    const types = getTypesFromSchema(schema);
    const resources = getResources(types, queries, options);

    return {
        types,
        queries,
        resources,
        schema,
    };
};

export type IntrospectionOptions = {
    schema?: IntrospectionSchema;
    operationNames: {
        [key: string]: (type: IntrospectionType) => string;
    };
    exclude?: string[] | ((type: IntrospectionType) => boolean);
    include?: string[] | ((type: IntrospectionType) => boolean);
};

export type IntrospectedResource = {
    type: IntrospectionObjectType;
};
export type IntrospectionResult = {
    types: IntrospectionType[];
    queries: IntrospectionObjectType[];
    resources: IntrospectedResource[];
    schema: IntrospectionSchema;
};

const fetchSchema = (
    client: ApolloClient<unknown>
): Promise<IntrospectionSchema> => {
    return client
        .query<IntrospectionQuery>({
            fetchPolicy: 'network-only',
            query: gql`
                ${getIntrospectionQuery()}
            `,
        })
        .then(({ data: { __schema } }) => __schema);
};

const getQueriesFromSchema = (
    schema: IntrospectionSchema
): IntrospectionObjectType[] => {
    return schema.types.reduce((acc, type) => {
        if (
            type.name !== schema.queryType?.name &&
            type.name !== schema.mutationType?.name &&
            (type as IntrospectionObjectType).fields
        ) {
            return acc;
        }

        return [...acc, ...((type as IntrospectionObjectType).fields || [])];
    }, []);
};

const getTypesFromSchema = (schema: IntrospectionSchema) => {
    return schema.types.filter(
        type =>
            type.name !== (schema.queryType && schema.queryType.name) &&
            type.name !== (schema.mutationType && schema.mutationType.name)
    );
};

const getResources = (
    types: IntrospectionType[],
    queries: IntrospectionObjectType[],
    options: IntrospectionOptions
): IntrospectedResource[] => {
    const filteredResources = types.filter(type =>
        isResource(type, queries, options)
    );
    return filteredResources.map(type =>
        buildResource(type as IntrospectionObjectType, queries, options)
    );
};

const isResource = (
    type: IntrospectionType,
    queries: IntrospectionObjectType[],
    options: IntrospectionOptions
) => {
    if (isResourceIncluded(type, options)) return true;
    if (isResourceExcluded(type, options)) return false;

    const operations = Object.keys(options.operationNames).map(operation =>
        options.operationNames[operation](type)
    );

    const hasAtLeastOneOperation = operations.some(operation =>
        queries.find(({ name }) => name === operation)
    );

    return hasAtLeastOneOperation;
};

export const isResourceIncluded = (
    type: IntrospectionType,
    { include }: Partial<IntrospectionOptions> = {}
) => {
    if (Array.isArray(include)) {
        return include.includes(type.name);
    }

    if (typeof include === 'function') {
        return include(type);
    }

    return false;
};

export const isResourceExcluded = (
    type: IntrospectionType,
    { exclude }: Partial<IntrospectionOptions> = {}
) => {
    if (Array.isArray(exclude)) {
        return exclude.includes(type.name);
    }

    if (typeof exclude === 'function') {
        return exclude(type);
    }

    return false;
};

const buildResource = (
    type: IntrospectionObjectType,
    queries: IntrospectionObjectType[],
    options: IntrospectionOptions
): IntrospectedResource => {
    return ALL_TYPES.reduce(
        (acc, raFetchMethod) => {
            const query = queries.find(
                ({ name }) =>
                    options.operationNames[raFetchMethod] &&
                    name === options.operationNames[raFetchMethod](type)
            );

            if (!query) return acc;

            return {
                ...acc,
                [raFetchMethod]: query,
            };
        },
        { type }
    );
};
