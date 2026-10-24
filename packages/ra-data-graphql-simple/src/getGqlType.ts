import { IntrospectionType, IntrospectionTypeRef, TypeNode } from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

export const getGqlType = (
    type: IntrospectionType | IntrospectionTypeRef
): TypeNode => {
    switch (type.kind) {
        case 'LIST':
            return gqlTypes.listType(getGqlType(type.ofType));

        case 'NON_NULL':
            return gqlTypes.nonNullType(getGqlType(type.ofType));

        default:
            return gqlTypes.namedType(gqlTypes.name(type.name));
    }
};
