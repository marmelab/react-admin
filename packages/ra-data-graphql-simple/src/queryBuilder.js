import { TypeKind } from 'graphql';
import gql from 'graphql-tag';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'react-admin';
import { QUERY_TYPES } from 'ra-data-graphql';

import { encodeQuery, encodeMutation } from './graphqlify';
/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type
 */
export const getFinalType = type => {
    if (type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST) {
        return getFinalType(type.ofType);
    }

    return type;
};

/**
 * Check wether the type is a LIST (or a NON_NULL LIST)
 * @param {GraphQLType} type
 */
export const isList = type => {
    if (type.kind === TypeKind.NON_NULL) {
        return isList(type.ofType);
    }

    return type.kind === TypeKind.LIST;
};

export const buildFields = introspectionResults => fields =>
    fields.reduce((acc, field) => {
        const type = getFinalType(field.type);

        if (type.name.startsWith('_')) {
            return acc;
        }

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [field.name]: {} };
        }

        const linkedResource = introspectionResults.resources.find(
            r => r.type.name === type.name
        );

        if (linkedResource) {
            return { ...acc, [field.name]: { fields: { id: {} } } };
        }

        const linkedType = introspectionResults.types.find(
            t => t.name === type.name
        );

        if (linkedType) {
            return {
                ...acc,
                [field.name]: {
                    fields: buildFields(introspectionResults)(
                        linkedType.fields
                    ),
                },
            };
        }

        // NOTE: We might have to handle linked types which are not resources but will have to be careful about
        // ending with endless circular dependencies
        return acc;
    }, {});

export const getArgType = arg => {
    if (arg.type.kind === TypeKind.NON_NULL) {
        return `${arg.type.ofType.name}!`;
    }

    return arg.type.name;
};

export const buildArgs = (query, variables) => {
    if (query.args.length === 0) {
        return '';
    }

    const validVariables = Object.keys(variables).filter(
        k => !!variables[k] && variables[k] !== null
    );
    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce(
            (acc, arg) => ({ ...acc, [`${arg.name}`]: `$${arg.name}` }),
            {}
        );

    return args;
};

export const buildApolloArgs = (query, variables) => {
    if (query.args.length === 0) {
        return '';
    }

    const validVariables = Object.keys(variables).filter(
        k => !!variables[k] && variables[k] !== null
    );

    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce((acc, arg) => {
            if (arg.name.endsWith('Ids')) {
                return { ...acc, [`$${arg.name}`]: '[ID!]' };
            }

            if (arg.name.endsWith('Id')) {
                return { ...acc, [`$${arg.name}`]: 'ID' };
            }

            return { ...acc, [`$${arg.name}`]: getArgType(arg) };
        }, {});

    return args;
};

// NOTE: Building queries by merging/concatenating strings is bad and dirty!
// The ApolloClient.query method accepts an object of the shape { query, variables }.
// The query is actually a DocumentNode which is builded by the gql tag function.
// We should investigate how to build such DocumentNode from introspection results
// as it would be more robust.
export const buildQuery = introspectionResults => (
    resource,
    aorFetchType,
    queryType,
    variables
) => {
    const apolloArgs = buildApolloArgs(queryType, variables);
    const args = buildArgs(queryType, variables);
    const fields = buildFields(introspectionResults)(resource.type.fields);
    if (
        aorFetchType === GET_LIST ||
        aorFetchType === GET_MANY ||
        aorFetchType === GET_MANY_REFERENCE
    ) {
        const result = encodeQuery(queryType.name, {
            params: apolloArgs,
            fields: {
                items: {
                    field: queryType.name,
                    params: args,
                    fields,
                },
                total: {
                    field: `_${queryType.name}Meta`,
                    params: args,
                    fields: { count: {} },
                },
            },
        });
        return result;
    }

    if (aorFetchType === DELETE) {
        return encodeMutation(queryType.name, {
            params: apolloArgs,
            fields: {
                data: {
                    field: queryType.name,
                    params: args,
                    fields: { id: {} },
                },
            },
        });
    }

    const query = {
        params: apolloArgs,
        fields: {
            data: {
                field: queryType.name,
                params: args,
                fields,
            },
        },
    };

    const result = QUERY_TYPES.includes(aorFetchType)
        ? encodeQuery(queryType.name, query)
        : encodeMutation(queryType.name, query);

    return result;
};

export const buildVariables = introspectionResults => (
    resource,
    aorFetchType,
    params,
    queryType
) => {
    switch (aorFetchType) {
        case GET_LIST: {
            const filter = Object.keys(params.filter).reduce((acc, key) => {
                if (key === 'ids') {
                    return { ...acc, ids: params.filter[key] };
                }

                if (typeof params.filter[key] === 'object') {
                    const type = introspectionResults.types.find(
                        t => t.name === `${resource.type.name}Filter`
                    );
                    const filterSome = type.inputFields.find(
                        t => t.name === `${key}_some`
                    );

                    if (filterSome) {
                        const filter = Object.keys(params.filter[key]).reduce(
                            (acc, k) => ({
                                ...acc,
                                [`${k}_in`]: params.filter[key][k],
                            }),
                            {}
                        );
                        return { ...acc, [`${key}_some`]: filter };
                    }
                }

                const parts = key.split('.');

                if (parts.length > 1) {
                    if (parts[1] == 'id') {
                        const type = introspectionResults.types.find(
                            t => t.name === `${resource.type.name}Filter`
                        );
                        const filterSome = type.inputFields.find(
                            t => t.name === `${parts[0]}_some`
                        );

                        if (filterSome) {
                            return {
                                ...acc,
                                [`${parts[0]}_some`]: {
                                    id: params.filter[key],
                                },
                            };
                        }

                        return {
                            ...acc,
                            [parts[0]]: { id: params.filter[key] },
                        };
                    }

                    const resourceField = resource.type.fields.find(
                        f => f.name === parts[0]
                    );
                    if (resourceField.type.name === 'Int') {
                        return { ...acc, [key]: parseInt(params.filter[key]) };
                    }
                    if (resourceField.type.name === 'Float') {
                        return {
                            ...acc,
                            [key]: parseFloat(params.filter[key]),
                        };
                    }
                }

                return { ...acc, [key]: params.filter[key] };
            }, {});

            return {
                skip: parseInt(
                    (params.pagination.page - 1) * params.pagination.perPage
                ),
                first: parseInt(params.pagination.perPage),
                orderBy: `${params.sort.field}_${params.sort.order}`,
                filter,
            };
        }
        case GET_MANY:
            return {
                filter: { ids: params.ids },
            };
        case GET_MANY_REFERENCE: {
            const parts = params.target.split('.');

            return {
                filter: { [parts[0]]: { id: params.id } },
            };
        }
        case GET_ONE:
            return {
                id: params.id,
            };
        case UPDATE: {
            return Object.keys(params.data).reduce((acc, key) => {
                if (Array.isArray(params.data[key])) {
                    const arg = queryType.args.find(
                        a => a.name === `${key}Ids`
                    );

                    if (arg) {
                        return {
                            ...acc,
                            [`${key}Ids`]: params.data[key].map(({ id }) => id),
                        };
                    }
                }

                if (typeof params.data[key] === 'object') {
                    const arg = queryType.args.find(a => a.name === `${key}Id`);

                    if (arg) {
                        return {
                            ...acc,
                            [`${key}Id`]: params.data[key].id,
                        };
                    }
                }

                return {
                    ...acc,
                    [key]: params.data[key],
                };
            }, {});
        }

        case CREATE: {
            return Object.keys(params.data).reduce((acc, key) => {
                if (Array.isArray(params.data[key])) {
                    const arg = queryType.args.find(
                        a => a.name === `${key}Ids`
                    );

                    if (arg) {
                        return {
                            ...acc,
                            [`${key}Ids`]: params.data[key].map(({ id }) => id),
                        };
                    }
                }

                if (typeof params.data[key] === 'object') {
                    const arg = queryType.args.find(a => a.name === `${key}Id`);

                    if (arg) {
                        return {
                            ...acc,
                            [`${key}Id`]: params.data[key].id,
                        };
                    }
                }

                return {
                    ...acc,
                    [key]: params.data[key],
                };
            }, {});
        }

        case DELETE:
            return {
                id: params.id,
            };
    }
};

export const sanitizeResource = (introspectionResults, resource) => data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const field = resource.type.fields.find(f => f.name === key);
        const type = getFinalType(field.type);

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [field.name]: data[field.name] };
        }

        // FIXME: We might have to handle linked types which are not resources but will have to be careful about
        // endless circular dependencies
        const linkedResource = introspectionResults.resources.find(
            r => r.type.name === type.name
        );

        if (linkedResource) {
            if (Array.isArray(data[field.name])) {
                return {
                    ...acc,
                    [field.name]: data[field.name].map(
                        sanitizeResource(introspectionResults, linkedResource)
                    ),
                    [`${field.name}Ids`]: data[field.name].map(d => d.id),
                };
            }

            return {
                ...acc,
                [`${field.name}.id`]: data[field.name].id,
                [field.name]: sanitizeResource(
                    introspectionResults,
                    linkedResource
                )(data[field.name]),
            };
        }
    }, {});

    return result;
};

export const getResponseParser = introspectionResults => (
    aorFetchType,
    resource
) => response => {
    const sanitize = sanitizeResource(introspectionResults, resource);
    const data = response.data;

    if (
        aorFetchType === GET_LIST ||
        aorFetchType === GET_MANY ||
        aorFetchType === GET_MANY_REFERENCE
    ) {
        return {
            data: response.data.items.map(sanitize),
            total: response.data.total.count,
        };
    }

    return { data: sanitize(data.data) };
};

export default introspectionResults => {
    const knownResources = introspectionResults.resources.map(r => r.type.name);

    return (aorFetchType, resourceName, params) => {
        const resource = introspectionResults.resources.find(
            r => r.type.name === resourceName
        );

        if (!resource) {
            throw new Error(
                `Unknown resource ${resource}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(
                    ', '
                )}`
            );
        }

        const queryType = resource[aorFetchType];

        if (!queryType) {
            throw new Error(
                `No query or mutation matching aor fetch type ${aorFetchType} could be found for resource ${
                    resource.type.name
                }`
            );
        }

        const variables = buildVariables(introspectionResults)(
            resource,
            aorFetchType,
            params,
            queryType
        );
        const query = buildQuery(introspectionResults)(
            resource,
            aorFetchType,
            queryType,
            variables
        );
        const parseResponse = getResponseParser(introspectionResults)(
            aorFetchType,
            resource,
            queryType
        );

        return {
            query: gql`
                ${query}
            `,
            variables,
            parseResponse,
        };
    };
};
