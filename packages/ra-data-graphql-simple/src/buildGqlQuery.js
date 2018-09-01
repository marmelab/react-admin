import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, DELETE } from 'react-admin';
import { QUERY_TYPES } from 'ra-data-graphql';
import { TypeKind } from 'graphql';
import * as graphqlTypes from 'graphql-ast-types';

import getFinalType from './getFinalType';
import isList from './isList';
import isRequired from './isRequired';

export const buildFields = introspectionResults => fields =>
    fields.reduce((acc, field) => {
        const type = getFinalType(field.type);

        if (type.name.startsWith('_')) {
            return acc;
        }

        if (type.kind !== TypeKind.OBJECT) {
            return [...acc, graphqlTypes.field(graphqlTypes.name(field.name))];
        }

        const linkedResource = introspectionResults.resources.find(
            r => r.type.name === type.name
        );

        if (linkedResource) {
            return [
                ...acc,
                graphqlTypes.field(
                    graphqlTypes.name(field.name),
                    null,
                    null,
                    null,
                    graphqlTypes.selectionSet([
                        graphqlTypes.field(graphqlTypes.name('id')),
                    ])
                ),
            ];
        }

        const linkedType = introspectionResults.types.find(
            t => t.name === type.name
        );

        if (linkedType) {
            return [
                ...acc,
                graphqlTypes.field(
                    graphqlTypes.name(field.name),
                    null,
                    null,
                    null,
                    graphqlTypes.selectionSet(
                        buildFields(introspectionResults)(linkedType.fields)
                    )
                ),
            ];
        }

        // NOTE: We might have to handle linked types which are not resources but will have to be careful about
        // ending with endless circular dependencies
        return acc;
    }, []);

export const getArgType = arg => {
    const type = getFinalType(arg.type);
    const required = isRequired(arg.type);
    const list = isList(arg.type);

    if (list) {
        if (required) {
            return graphqlTypes.listType(
                graphqlTypes.nonNullType(
                    graphqlTypes.namedType(graphqlTypes.name(type.name))
                )
            );
        }
        return graphqlTypes.listType(
            graphqlTypes.namedType(graphqlTypes.name(type.name))
        );
    }

    if (required) {
        return graphqlTypes.nonNullType(
            graphqlTypes.namedType(graphqlTypes.name(type.name))
        );
    }

    return graphqlTypes.namedType(graphqlTypes.name(type.name));
};

export const buildArgs = (query, variables) => {
    if (query.args.length === 0) {
        return [];
    }

    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );
    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce(
            (acc, arg) => [
                ...acc,
                graphqlTypes.argument(
                    graphqlTypes.name(arg.name),
                    graphqlTypes.variable(graphqlTypes.name(arg.name))
                ),
            ],
            []
        );

    return args;
};

export const buildApolloArgs = (query, variables) => {
    if (query.args.length === 0) {
        return [];
    }

    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );

    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce((acc, arg) => {
            return [
                ...acc,
                graphqlTypes.variableDefinition(
                    graphqlTypes.variable(graphqlTypes.name(arg.name)),
                    getArgType(arg)
                ),
            ];
        }, []);

    return args;
};

export default introspectionResults => (
    resource,
    aorFetchType,
    queryType,
    variables
) => {
    const { sortField, sortOrder, ...metaVariables } = variables;
    const apolloArgs = buildApolloArgs(queryType, variables);
    const args = buildArgs(queryType, variables);
    const metaArgs = buildArgs(queryType, metaVariables);
    const fields = buildFields(introspectionResults)(resource.type.fields);
    if (
        aorFetchType === GET_LIST ||
        aorFetchType === GET_MANY ||
        aorFetchType === GET_MANY_REFERENCE
    ) {
        return graphqlTypes.document([
            graphqlTypes.operationDefinition(
                'query',
                graphqlTypes.selectionSet([
                    graphqlTypes.field(
                        graphqlTypes.name(queryType.name),
                        graphqlTypes.name('items'),
                        args,
                        null,
                        graphqlTypes.selectionSet(fields)
                    ),
                    graphqlTypes.field(
                        graphqlTypes.name(`_${queryType.name}Meta`),
                        graphqlTypes.name('total'),
                        metaArgs,
                        null,
                        graphqlTypes.selectionSet([
                            graphqlTypes.field(graphqlTypes.name('count')),
                        ])
                    ),
                ]),
                graphqlTypes.name(queryType.name),
                apolloArgs
            ),
        ]);
    }

    if (aorFetchType === DELETE) {
        return graphqlTypes.document([
            graphqlTypes.operationDefinition(
                'mutation',
                graphqlTypes.selectionSet([
                    graphqlTypes.field(
                        graphqlTypes.name(queryType.name),
                        graphqlTypes.name('data'),
                        args,
                        null,
                        graphqlTypes.selectionSet([
                            graphqlTypes.field(graphqlTypes.name('id')),
                        ])
                    ),
                ]),
                graphqlTypes.name(queryType.name),
                apolloArgs
            ),
        ]);
    }

    return graphqlTypes.document([
        graphqlTypes.operationDefinition(
            QUERY_TYPES.includes(aorFetchType) ? 'query' : 'mutation',
            graphqlTypes.selectionSet([
                graphqlTypes.field(
                    graphqlTypes.name(queryType.name),
                    graphqlTypes.name('data'),
                    args,
                    null,
                    graphqlTypes.selectionSet(fields)
                ),
            ]),
            graphqlTypes.name(queryType.name),
            apolloArgs
        ),
    ]);
};
