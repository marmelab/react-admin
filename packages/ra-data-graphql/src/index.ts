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
} from 'ra-core';
import { LegacyDataProvider } from 'ra-core/lib';

import buildApolloClient, { BuildClientOptions } from './buildApolloClient';
import { OperationName } from './constants';
import defaultResolveIntrospection, {
    IntrospectedSchema,
    IntrospectionOptions,
} from './introspection';

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

export interface GraphQLProviderOptions<OtherOptions = any> {
    client?: ApolloClient<unknown>;
    clientOptions?: BuildClientOptions<unknown>;
    introspection?: IntrospectionOptions;
    resolveIntrospection?: (
        client: ApolloClient<unknown>,
        options: IntrospectionOptions
    ) => Promise<IntrospectedSchema> | IntrospectedSchema;
    buildQuery: (
        schema: IntrospectedSchema,
        otherOptions: OtherOptions
    ) => (
        raFetchType: OperationName,
        resourceName: string,
        params: any
    ) => QueryHandler;
    query?:
        | QueryOptions
        | ((resource: string, raFetchType: OperationName) => QueryOptions);
    mutation?:
        | MutationOptions
        | ((resource: string, raFetchType: OperationName) => MutationOptions);
    watchQuery?:
        | WatchQueryOptions
        | ((resource: string, raFetchType: OperationName) => WatchQueryOptions);
    // @deprecated
    override?: Record<string, (params: any) => QueryHandler>;
}

interface QueryHandler {
    query: DocumentNode;
    variables: Record<string, any>;
    parseResponse: (response: ApolloQueryResult<any> | FetchResult) => any;
}

export default async <Options extends {} = any>(
    options: Options & GraphQLProviderOptions<Options>
): Promise<LegacyDataProvider> => {
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

    const raDataProvider = (aorFetchType, resource, params) => {
        const overriddenBuildQuery: (params: any) => QueryHandler = get(
            override,
            `${resource}.${aorFetchType}`
        );

        const { parseResponse, ...query } = overriddenBuildQuery
            ? {
                  ...buildQuery(aorFetchType, resource, params),
                  ...overriddenBuildQuery(params),
              }
            : buildQuery(aorFetchType, resource, params);

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

    raDataProvider.observeRequest = (aorFetchType, resource, params) => {
        const { parseResponse, ...query } = buildQuery(
            aorFetchType,
            resource,
            params
        );

        const apolloQuery = {
            ...query,
            ...getOptions(otherOptions.watchQuery, aorFetchType, resource),
        };

        return client.watchQuery(apolloQuery).map(parseResponse);
    };

    raDataProvider.saga = () => {};

    return raDataProvider;
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
