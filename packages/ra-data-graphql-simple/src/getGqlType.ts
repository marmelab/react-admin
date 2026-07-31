import {
    IntrospectionType,
    IntrospectionTypeRef,
    TypeKind,
    TypeNode,
} from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

export const getGqlType = (
    type: IntrospectionType | IntrospectionTypeRef
): TypeNode => {
    if ('ofType' in type) {
        return type.kind === TypeKind.LIST
            ? gqlTypes.listType(getGqlType(type.ofType))
            : gqlTypes.nonNullType(getGqlType(type.ofType));
    }

    return gqlTypes.namedType(gqlTypes.name(type.name));
};
