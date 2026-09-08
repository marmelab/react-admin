import {
    IntrospectionListTypeRef,
    IntrospectionType,
    IntrospectionTypeRef,
    TypeKind,
    TypeNode,
} from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

export const getGqlType = (
    type: IntrospectionType | IntrospectionListTypeRef | IntrospectionTypeRef
): TypeNode => {
    switch (type.kind) {
        case TypeKind.LIST:
            return gqlTypes.listType(getGqlType(type.ofType));

        case TypeKind.NON_NULL:
            return gqlTypes.nonNullType(getGqlType(type.ofType));

        default:
            return gqlTypes.namedType(gqlTypes.name(type.name));
    }
};
