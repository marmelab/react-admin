import ApolloClient from 'apollo-client';
import {
    IntrospectionField,
    IntrospectionObjectType,
    IntrospectionQuery,
    IntrospectionType,
    getIntrospectionQuery,
} from 'graphql';
import gql from 'graphql-tag';
import { IntrospectionSchema } from 'graphql/utilities/introspectionQuery';
import { GET_LIST, GET_ONE, FetchType } from 'ra-core';

import { ALL_TYPES } from './constants';

export const filterTypesByIncludeExclude = ({
    include,
    exclude,
}: Pick<IntrospectionOptions, 'include' | 'exclude'>): ((
    type: IntrospectionType
) => boolean) => {
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

export interface IntrospectionOptions {
    schema?: IntrospectionSchema;
    operationNames: { [Op in FetchType]?: (type: IntrospectionType) => string };
    include?: Filter;
    exclude?: Filter;
}

type Filter = string[] | ((type: IntrospectionType) => boolean);

export interface IntrospectedSchema {
    types: IntrospectionType[];
    queries: IntrospectionField[];
    resources: IntrospectedResource[];
    schema: IntrospectionSchema;
}

export type IntrospectedResource = {
    type: IntrospectionType;
    GET_LIST: IntrospectionField;
    GET_ONE: IntrospectionField;
} & Record<
    Exclude<FetchType, 'GET_LIST' | 'GET_ONE'>,
    IntrospectionField | undefined
>;

/**
 * @param {ApolloClient} client The Apollo client
 * @param {Object} options The introspection options
 */
export default async (
    client: ApolloClient<unknown>,
    options: IntrospectionOptions
): Promise<IntrospectedSchema> => {
    const schema = options.schema
        ? options.schema
        : await client
              .query<IntrospectionQuery>({
                  fetchPolicy: 'network-only',
                  query: gql`
                      ${getIntrospectionQuery()}
                  `,
              })
              .then(({ data: { __schema } }) => __schema);

    const queries: IntrospectionField[] = schema.types.reduce((acc, type) => {
        if (
            type.name !== schema.queryType.name &&
            type.name !== schema.mutationType.name
        )
            return acc;

        const { fields = [] } = type as IntrospectionObjectType;

        return [...acc, ...fields];
    }, []);

    const types = schema.types.filter(
        type =>
            type.name !== schema.queryType.name &&
            type.name !== schema.mutationType.name
    );

    const isResource = (type: IntrospectionType) =>
        queries.some(
            query => query.name === options.operationNames[GET_LIST](type)
        ) &&
        queries.some(
            query => query.name === options.operationNames[GET_ONE](type)
        );

    const buildResource = (type: IntrospectionType): IntrospectedResource =>
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
            { type } as IntrospectedResource
        );

    const potentialResources = types.filter(isResource);
    const filteredResources = potentialResources.filter(
        filterTypesByIncludeExclude(options)
    );
    const resources = filteredResources.map(buildResource);

    return {
        types,
        queries,
        resources,
        schema,
    };
};
