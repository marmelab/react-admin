import merge from 'lodash/merge';
import get from 'lodash/get';
import pluralize from 'pluralize';
import {
    DataProvider,
    HttpError,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
} from 'ra-core';
import {
    ApolloClient,
    ApolloClientOptions,
    ApolloError,
    ApolloQueryResult,
    MutationOptions,
    WatchQueryOptions,
    QueryOptions,
    OperationVariables,
    ServerError,
} from '@apollo/client';

import buildApolloClient from './buildApolloClient';
import {
    QUERY_TYPES as INNER_QUERY_TYPES,
    MUTATION_TYPES as INNER_MUTATION_TYPES,
    ALL_TYPES as INNER_ALL_TYPES,
} from './constants';
import {
    introspectSchema,
    IntrospectionOptions,
    IntrospectionResult,
} from './introspection';

export * from './introspection';
export const QUERY_TYPES = INNER_QUERY_TYPES;
export const MUTATION_TYPES = INNER_MUTATION_TYPES;
export const ALL_TYPES = INNER_ALL_TYPES;

/**
 * Map dataProvider method names to GraphQL queries and mutations
 *
 * @example for the Customer resource:
 * dataProvider.getList()          // query allCustomers() { ... }
 * dataProvider.getOne()           // query Customer($id: id) { ... }
 * dataProvider.getMany()          // query allCustomers($filter: { ids: [ids] }) { ... }
 * dataProvider.getManyReference() // query allCustomers($filter: { [target]: [id] }) { ... }
 * dataProvider.create()           // mutation createCustomer($firstName: firstName, $lastName: lastName, ...) { ... }
 * dataProvider.update()           // mutation updateCustomer($id: id, firstName: firstName, $lastName: lastName, ...) { ... }
 * dataProvider.delete()           // mutation deleteCustomer($id: id) { ... }
 * // note that updateMany and deleteMany aren't mapped in this adapter
 */
const defaultOptions = {
    resolveIntrospection: introspectSchema,
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

const getOptions = (
    options: GetQueryOptions | GetMutationOptions | GetWatchQueryOptions,
    raFetchMethod: string,
    resource: string
) => {
    if (typeof options === 'function') {
        return options(resource, raFetchMethod);
    }

    return options;
};

export type BuildQueryResult = QueryOptions<OperationVariables, any> & {
    parseResponse: (response: ApolloQueryResult<any>) => any;
};

export type BuildQuery = (
    name: string,
    resource: string,
    params: any
) => BuildQueryResult;

export type BuildQueryFactory = (
    introspectionResults: IntrospectionResult
) => BuildQuery;

export type GetQueryOptions = (
    resource: string,
    raFetchMethod: string
) => Partial<QueryOptions<OperationVariables, any>>;

export type GetMutationOptions = (
    resource: string,
    raFetchMethod: string
) => Partial<MutationOptions<OperationVariables, any>>;

export type GetWatchQueryOptions = (
    resource: string,
    raFetchMethod: string
) => Partial<WatchQueryOptions<OperationVariables, any>>;

export type Options = {
    client?: ApolloClient<unknown>;
    clientOptions?: Partial<ApolloClientOptions<unknown>>;
    introspection?: false | Partial<IntrospectionOptions>;
    override?: {
        [key: string]: (params: any) => BuildQueryResult;
    };
    buildQuery: BuildQueryFactory;
    query?: GetQueryOptions;
    mutation?: GetMutationOptions;
    watchQuery?: GetWatchQueryOptions;
};

// @FIXME in v5: This doesn't need to be an async method
const buildGraphQLProvider = async (
    options: Options
): Promise<DataProvider> => {
    const {
        client: clientObject,
        clientOptions,
        introspection,
        resolveIntrospection,
        buildQuery: buildQueryFactory,
        override = {},
        ...otherOptions
    } = merge({}, defaultOptions, options);

    if (override && process.env.NODE_ENV === 'production') {
        console.warn(
            // eslint-disable-line
            'The override option is deprecated. You should instead wrap the buildQuery function provided by the dataProvider you use.'
        );
    }

    const client = clientObject || buildApolloClient(clientOptions);

    let introspectionResults;
    let introspectionResultsPromise;

    const callApollo = async (raFetchMethod, resource, params) => {
        if (introspection) {
            if (!introspectionResultsPromise) {
                introspectionResultsPromise = resolveIntrospection(
                    client,
                    introspection
                );
            }

            introspectionResults = await introspectionResultsPromise;
        }

        const buildQuery = buildQueryFactory(introspectionResults);
        const overriddenBuildQuery = get(
            override,
            `${resource}.${raFetchMethod}`
        );

        const { parseResponse, ...query } = overriddenBuildQuery
            ? {
                  ...buildQuery(raFetchMethod, resource, params),
                  ...overriddenBuildQuery(params),
              }
            : buildQuery(raFetchMethod, resource, params);

        const operation = getQueryOperation(query.query);

        if (operation === 'query') {
            const apolloQuery = {
                ...query,
                fetchPolicy: 'network-only',
                ...getOptions(otherOptions.query, raFetchMethod, resource),
            };

            return (
                client
                    // @ts-ignore
                    .query(apolloQuery)
                    .then(response => parseResponse(response))
                    .catch(handleError)
            );
        }

        const apolloQuery = {
            mutation: query.query,
            variables: query.variables,
            ...getOptions(otherOptions.mutation, raFetchMethod, resource),
        };

        return (
            client
                // @ts-ignore
                .mutate(apolloQuery)
                .then(parseResponse)
                .catch(handleError)
        );
    };

    const raDataProvider = {
        create: (resource, params) => callApollo(CREATE, resource, params),
        delete: (resource, params) => callApollo(DELETE, resource, params),
        deleteMany: (resource, params) =>
            callApollo(DELETE_MANY, resource, params),
        getList: (resource, params) => callApollo(GET_LIST, resource, params),
        getMany: (resource, params) => callApollo(GET_MANY, resource, params),
        getManyReference: (resource, params) =>
            callApollo(GET_MANY_REFERENCE, resource, params),
        getOne: (resource, params) => callApollo(GET_ONE, resource, params),
        update: (resource, params) => callApollo(UPDATE, resource, params),
        updateMany: (resource, params) =>
            callApollo(UPDATE_MANY, resource, params),
    };

    return raDataProvider;
};

const handleError = (error: ApolloError) => {
    if (error?.networkError as ServerError) {
        throw new HttpError(
            (error?.networkError as ServerError)?.message,
            (error?.networkError as ServerError)?.statusCode
        );
    }

    throw new HttpError(error.message, 200, error);
};

const getQueryOperation = query => {
    if (query && query.definitions && query.definitions.length > 0) {
        return query.definitions[0].operation;
    }

    throw new Error('Unable to determine the query operation');
};

export default buildGraphQLProvider;
