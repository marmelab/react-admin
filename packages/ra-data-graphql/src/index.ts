import ApolloClient, { ApolloQueryResult, QueryOptions } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import {
    MutationOptions,
    WatchQueryOptions,
} from 'apollo-client/core/watchQueryOptions';
import { DocumentNode } from 'graphql';
import { OperationTypeNode } from 'graphql/language/ast';
import merge from 'lodash/merge';
import get from 'lodash/get';
import pluralize from 'pluralize';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
    sanitizeFetchType,
    DataProvider,
    FetchType,
    GetListParams,
} from 'ra-core';

import buildApolloClient, { BuildClientOptions } from './buildApolloClient';
import defaultResolveIntrospection, {
    IntrospectedSchema,
    IntrospectionOptions,
} from './introspection';

export * from './introspection';
export * from './constants';

const defaultOptions: Partial<GraphQLProviderOptions> = {
    resolveIntrospection: defaultResolveIntrospection,
    introspection: {
        operationNames: {
            [GET_LIST]: resource => `all${pluralize(resource.name)}`,
            [GET_ONE]: resource => `${resource.name}`,
            [GET_MANY]: resource => `all${pluralize(resource.name)}`,
            [GET_MANY_REFERENCE]: resource => `all${pluralize(resource.name)}`,
            [CREATE]: resource => `create${resource.name}`,
            [UPDATE]: resource => `update${resource.name}`,
            [DELETE]: resource => `delete${resource.name}`,
        },
        exclude: undefined,
        include: undefined,
    },
};

const getOptions = (options, aorFetchType, resource) => {
    if (typeof options === 'function') {
        return options(resource, aorFetchType);
    }

    return options;
};

export type QueryBuilder<OtherOptions = any> = (
    schema: IntrospectedSchema,
    otherOptions?: OtherOptions
) => (
    raFetchType: FetchType,
    resourceName: string,
    params: GetListParams
) => QueryHandler;

export interface GraphQLProviderOptions<OtherOptions = any> {
    client?: ApolloClient<unknown>;
    clientOptions?: BuildClientOptions<unknown>;
    introspection?: IntrospectionOptions;
    resolveIntrospection?: (
        client: ApolloClient<unknown>,
        options: IntrospectionOptions
    ) => Promise<IntrospectedSchema> | IntrospectedSchema;
    buildQuery: QueryBuilder<OtherOptions>;
    query?:
        | QueryOptions
        | ((resource: string, raFetchType: FetchType) => QueryOptions);
    mutation?:
        | MutationOptions
        | ((resource: string, raFetchType: FetchType) => MutationOptions);
    // @deprecated
    watchQuery?:
        | WatchQueryOptions
        | ((resource: string, raFetchType: FetchType) => WatchQueryOptions);
    // @deprecated
    override?: Record<string, (params: GetListParams) => QueryHandler>;
}

interface QueryHandler {
    query: DocumentNode;
    variables: Record<string, any>;
    parseResponse: (response: ApolloQueryResult<any> | FetchResult) => any;
}

export default async <Options extends {} = any>(
    options: Options & GraphQLProviderOptions<Options>
): Promise<DataProvider> => {
    const {
        client: clientObject,
        clientOptions,
        introspection,
        resolveIntrospection,
        buildQuery: buildQueryFactory,
        override = {},
        ...otherOptions
    } = merge({}, defaultOptions, options) as typeof options;

    if (override && process.env.NODE_ENV === 'production') {
        console.warn(
            // eslint-disable-line
            'The override option is deprecated. You should instead wrap the buildQuery function provided by the dataProvider you use.'
        );
    }

    const client = clientObject || buildApolloClient(clientOptions);

    let introspectionResults: IntrospectedSchema;
    if (introspection) {
        introspectionResults = await resolveIntrospection(
            client,
            introspection
        );
    }

    const buildQuery = buildQueryFactory(
        introspectionResults,
        otherOptions as Options
    );

    const handle = (aorFetchType: FetchType, resource: string, params: any) => {
        const overriddenBuildQuery: (
            params: Record<string, any>
        ) => QueryHandler = get(
            override,
            `${resource}.${sanitizeFetchType(aorFetchType)}`
        );

        const { parseResponse = null, ...query } = overriddenBuildQuery
            ? {
                  ...buildQuery(aorFetchType, resource, params),
                  ...overriddenBuildQuery(params),
              }
            : buildQuery(aorFetchType, resource, params);

        if (!parseResponse) {
            throw new Error(
                `Missing '${sanitizeFetchType(
                    aorFetchType
                )}' in the override option`
            );
        }

        const operation = getQueryOperation(query.query);

        if (operation === 'query') {
            const apolloQuery = {
                ...query,
                fetchPolicy: 'network-only',
                ...getOptions(otherOptions.query, aorFetchType, resource),
            };

            return client
                .query(apolloQuery)
                .then(response => parseResponse(response));
        }

        const apolloQuery = {
            mutation: query.query,
            variables: query.variables,
            ...getOptions(otherOptions.mutation, aorFetchType, resource),
        };

        return client.mutate(apolloQuery).then(parseResponse);
    };

    return {
        getList: (resource, params) => handle(GET_LIST, resource, params),
        getOne: (resource, params) => handle(GET_ONE, resource, params),
        getMany: (resource, params) => handle(GET_MANY, resource, params),
        getManyReference: (resource, params) =>
            handle(GET_MANY_REFERENCE, resource, params),
        update: (resource, params) => handle(UPDATE, resource, params),
        updateMany: (resource, params) => handle(UPDATE_MANY, resource, params),
        create: (resource, params) => handle(CREATE, resource, params),
        delete: (resource, params) => handle(DELETE, resource, params),
        deleteMany: (resource, params) => handle(DELETE_MANY, resource, params),
    };
};

const getQueryOperation = (query: DocumentNode): OperationTypeNode => {
    if (query && query.definitions && query.definitions.length > 0) {
        const node = query.definitions[0];
        if (node.kind === 'OperationDefinition') {
            return node.operation;
        }
    }

    throw new Error('Unable to determine the query operation');
};
